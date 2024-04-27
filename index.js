const { Telegraf, Markup } = require("telegraf");
const { workoutsCommand } = require("./commands/workouts");
const { newSetCommand } = require("./commands/newSet");
const { startCommand } = require("./commands/start");
const { getStat } = require("./commands/getStat");
const { commands } = require("./help");
const botHelper = require("./helpers/helpers");
const userState = require("./userState/userState");
const {
  addNewSetAction,
  finishNewSetAction,
} = require("./actions/addNewSetAction/addNewSetAction");
const {
  removeExistingSetAction,
  finishRemoveSetAction,
} = require("./actions/removeExistingSetAction/removeExistingSetAction");

const {
  createNewUserAction,
  finishNewUserRegistration,
} = require("./actions/createNewUserAction/createNewUserAction");
const {
  createNewWorkoutAction,
} = require("./actions/workoutAction/createNewWorkout/createNewWorkout");
const {
  closeWorkoutAction,
} = require("./actions/workoutAction/closeCurrentWorkout/closeCurrentWorkout");
const mongoose = require("mongoose");
const {
  personalBestAction,
} = require("./actions/statisticActions/personalBestAction/personalBestAction");

require("dotenv").config();

mongoose.connect(process.env.MONGO_CLIENT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  try {
    await botHelper.historyDestroyer(ctx);
    await startCommand(ctx);
  } catch (error) {
    console.log("error in start");
    console.log(error.message);
  }
});

bot.command("workouts", async (ctx) => {
  try {
    await botHelper.historyDestroyer(ctx);
    await workoutsCommand(ctx);
  } catch (error) {
    console.log("Error in 'bot.command'newTraining'");
    console.log(error.message);
    console.log(error);
    await ctx.reply(error.message);
  }
});

bot.command("newSet", async (ctx) => {
  try {
    await botHelper.historyDestroyer(ctx);
    await newSetCommand(ctx);
  } catch (error) {
    console.log("Error in 'bot.command'newSet'");
    console.log(error.message);
    await ctx.reply(error.message);
  }
});

bot.command("getStat", async (ctx) => {
  try {
    await botHelper.historyDestroyer(ctx);
    await getStat(ctx);
  } catch (error) {
    console.log("Error in 'bot.command'getStat'");
    console.log(error.message);
    await ctx.reply(error.message);
  }
});

bot.help(async (ctx) => {
  await botHelper.historyDestroyer(ctx);
  ctx.reply(commands);
});

// Тип функций приложения, типа ENUM
const functionsEnum = {
  createNewWorkout: botHelper.getWorkoutOptions()[0],
  closeCurrentWorkout: botHelper.getWorkoutOptions()[1],
  createNewSet: botHelper.getButtonsLabelsForNewSetCommand()[0],
  removeExistSet: botHelper.getButtonsLabelsForNewSetCommand()[1],
  createNewUser: botHelper.getstartOptions()[0],
  personalBests: botHelper.getStatOptions()[0],
};

bot.action(new RegExp(), async (ctx) => {
  try {
    await botHelper.historyDestroyer(ctx);
    const username = botHelper.checkUserNameFromCallbackQuery(ctx);
    const typeOfAction = ctx.callbackQuery.data.split("=")[1];
    const currentUser = userState.findUser(username);
    if (!currentUser) {
      throw new Error(
        "Незарегистрированный пользователь, выполните команду '/start'"
      );
      return;
    }

    currentUser.updatePath(typeOfAction); // Добавляет указание по какому пути должен идти скрипт
    const individualScriptPointer = currentUser.path.split("/")[0];

    switch (individualScriptPointer) {
      case functionsEnum.createNewWorkout:
        const error0 = await createNewWorkoutAction(ctx);
        if (error0) throw error0;
        break;
      case functionsEnum.closeCurrentWorkout:
        const error01 = await closeWorkoutAction(ctx);
        if (error01) throw error01;
        break;
      case functionsEnum.createNewSet:
        const error1 = await addNewSetAction(ctx);
        if (error1) throw error1;
        break;
      case functionsEnum.removeExistSet:
        const error2 = await removeExistingSetAction(ctx);
        if (error2) throw error2;
        break;
      case functionsEnum.createNewUser:
        createNewUserAction(ctx);
        break;
      case functionsEnum.personalBests:
        await personalBestAction(ctx);
        break;

      default:
        currentUser.resetPath();
        await ctx.reply("Ошибка в логике, попробуйте еще раз");
        break;
    }
  } catch (error) {
    console.error(error.message);
    console.log("Error in bot.action(new RegExp()");
    await ctx.reply(error.message);
  }
});

bot.on("message", async (ctx) => {
  try {
    const userName = botHelper.checkUserName(ctx);
    const currentUser = userState.findUser(userName);
    if (!currentUser) {
      throw new Error(
        "Незарегистрированный пользователь, выполните команду '/start'"
      );
      return;
    }

    const message = ctx.message.text;
    const isNanMessage = Number.isNaN(+message);
    const individualScriptPointer = currentUser.path.split("/")[0];
    if (!individualScriptPointer) return await botHelper.historyDestroyer(ctx);

    switch (individualScriptPointer) {
      case functionsEnum.createNewSet:
        if (Object.entries(currentUser.answers).every((answ) => answ != null)) {
          if (isNanMessage)
            return ctx.reply("Некорректные данные веса! Введите число!");

          await finishNewSetAction(ctx, currentUser, message);
        }
        break;
      case functionsEnum.removeExistSet:
        const error = await finishRemoveSetAction(ctx, message);
        if (error) throw error;
        break;

      case functionsEnum.createNewUser:
        await finishNewUserRegistration(ctx, message);
        break;
      default:
        currentUser.resetPath();
        await botHelper.historyDestroyer(ctx);
        break;
    }
  } catch (error) {
    console.error(error.message);
    await ctx.reply(error.message);
  }
});

bot.launch();
