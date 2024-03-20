const { Telegraf, Markup } = require("telegraf");
const { newTrainingCommand } = require("./commands/newTraining");
const { newSetCommand } = require("./commands/newSet");
const {
  markupReplier,
  buttonsLabelsForNewSetCommand,
  checkUserName,
  checkUserNameFromCallbackQuery,
} = require("./helpers/helpers");
const userState = require("./userState/userState");
const {
  addNewSetAction,
  finishNewSetAction,
} = require("./actions/addNewSetAction/addNewSetAction");
const {
  removeExistingSetAction,
  finishRemoveSetAction,
} = require("./actions/removeExistingSetAction/removeExistingSetAction");
const mongoose = require("mongoose");

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
    ctx.reply("Jopa");
  } catch (error) {
    console.log("error in start");
    console.log(error.message);
  }
});

bot.command("newTraining", async (ctx) => {
  try {
    await newTrainingCommand(ctx);
  } catch (error) {
    console.log("Error in 'bot.command'newTraining'");
    console.log(error.message);
  }
});

bot.command("newSet", async (ctx) => {
  try {
    await newSetCommand(ctx);
  } catch (error) {
    console.log("Error in 'bot.command'newSet'");
    console.log(error.message);
  }
});

bot.help((ctx) => {
  ctx.reply(comands);
});

// Тип функций приложения, типа ENUM
const functionsEnum = {
  createNewSet: buttonsLabelsForNewSetCommand[0],
  removeExistSet: buttonsLabelsForNewSetCommand[1],
};

bot.action(new RegExp(), async (ctx) => {
  try {
    const username = checkUserNameFromCallbackQuery(ctx);
    const typeOfAction = ctx.callbackQuery.data.split("=")[1];
    const currentUser = userState.findUser(username);
    currentUser.updatePath(typeOfAction); // Добавляет указание по какому пути должен идти скрипт
    const individualScriptPointer = currentUser.path.split("/")[0];

    switch (individualScriptPointer) {
      case functionsEnum.createNewSet:
        addNewSetAction(ctx);
        break;
      case functionsEnum.removeExistSet:
        removeExistingSetAction(ctx);
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    console.log("Error in bot.action(new RegExp()");
    await ctx.reply("Unexpect error, try again...");
  }
});

bot.on("message", async (ctx) => {
  // Вынести в отдельную функцию, при добавлении функционала, может заюзать свитч-кейс
  const userName = checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  const message = ctx.message.text;
  const isNanMessage = Number.isNaN(+message);
  const individualScriptPointer = currentUser.path.split("/")[0];

  try {
    switch (individualScriptPointer) {
      case functionsEnum.createNewSet:
        if (Object.entries(currentUser.answers).every((answ) => answ != null)) {
          if (isNanMessage)
            return ctx.reply("Некорректные данные веса! Введите число!");

          await finishNewSetAction(ctx, currentUser, message);
        }
        break;
      case functionsEnum.removeExistSet:
        await finishRemoveSetAction(ctx, message);
        break;

      default:
        break;
    }
  } catch (error) {
    await ctx.reply("Unexpected error, try again...");
  }
});

bot.launch();
