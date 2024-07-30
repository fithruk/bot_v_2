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

module.exports = { createNewWorkoutAction };
// await communicator.markupReplier(
//   "Выберите нужную опцию :",
//   ["Свободная тренировка", "Тренировка по плану"],
//   "typeOfAction"
// );
