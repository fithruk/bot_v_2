const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");
const Communicator = require("../../../communicator/communicator");

const createNewWorkoutAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const communicator = new Communicator(ctx);
  const responce = await apiService.initialNewTraining(userName);
  botHelper.resetUserPath(userName);

  switch (responce.status) {
    case "succes":
      communicator.reply("Новая тренировка успешно создана");
      return;

    case "exist":
      communicator.reply("Актуальная тренировка еще не закончена");
      return;

    case "error":
      return new Error("error");
    default:
      return new Error("unexpected error");
  }
};

const workoutSwitch = async (ctx) => {
  const communicator = new Communicator(ctx);
  await communicator.markupReplier(
    "Выберите нужную опцию :",
    botHelper.getWorkoutOptions().slice(4),
    "typeOfAction"
  );
};

const workoutWithProgramAction = async (ctx) => {
  const communicator = new Communicator(ctx);
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);

  const responce = await apiService.initialNewTrainingWithPpogram(userName);
  botHelper.resetUserPath(userName);

  switch (responce.status) {
    case "succes":
      communicator.reply(
        "Новая тренировка успешно создана, план доступен там-то там-то"
      );
      return;

    case "exist":
      communicator.reply("Актуальная тренировка еще не закончена");
      return;

    case "error":
      return new Error("У вас не осталось тренировок с тренером");
    default:
      return new Error("unexpected error");
  }
};

module.exports = {
  createNewWorkoutAction,
  workoutSwitch,
  workoutWithProgramAction,
};
