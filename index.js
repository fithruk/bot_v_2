const { Telegraf, Markup } = require("telegraf");
const { newTrainingCommand } = require("./commands/newTraining");
const { newSetCommand } = require("./commands/newSet");
const {
  markupReplier,
  buttonsLabelsForNewSetCommand,
  checkUserName,
  checkUserNameFromCallbackQuery,
  callbackCreator,
} = require("./helpers/helpers");
const { apiService } = require("./apiService/apiService");
const userState = require("./userState/userState");
const {
  addNewSetAction,
} = require("./actions/addNewSetAction/addNewSetAction");
const {
  removeExistingSetAction,
} = require("./actions/editExistingSetAction/editExistingSetAction");
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
    console.log(error);
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

bot.action(new RegExp(), async (ctx) => {
  try {
    const username = checkUserNameFromCallbackQuery(ctx);
    const typeOfAction = ctx.callbackQuery.data.split("=")[1];
    const currentUser = userState.findUser(username);
    currentUser.updatePath(typeOfAction); // Добавляет указание по какому пути должен идти скрипт
    const individualScriptPointer = currentUser.path.split("/")[0];

    // Тип функций приложения, типа ENUM
    const functionsEnum = {
      createNewSet: buttonsLabelsForNewSetCommand[0],
      removeExistSet: buttonsLabelsForNewSetCommand[1],
    };

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
    console.log("Error in bot.action(new RegExp()");
  }
});

bot.on("message", async (ctx) => {
  // Вынести в отдельную функцию, при добавлении функционала, может заюзать свитч-кейс
  const userName = checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  const message = ctx.message.text;
  const isNanMessage = Number.isNaN(+message);

  if (
    currentUser.answers.countOfReps &&
    currentUser.answers.exersice &&
    currentUser.answers.currentGroup
  ) {
    if (isNanMessage) return ctx.reply("Некорректные данные веса!");

    const callback = callbackCreator("weightOfequipment", +message);
    currentUser.updateUnswers(callback);
    await apiService.updateTrainingPerfomance(
      userName,
      currentUser.answers.exersice,
      currentUser.answers.countOfReps,
      currentUser.answers.weightOfequipment
    );
    currentUser.resetUnswers();
    currentUser.resetCurrentLabel();
    ctx.reply("Подход успешно сохранен!");
  } // Порефакторить условие
});

bot.launch();
