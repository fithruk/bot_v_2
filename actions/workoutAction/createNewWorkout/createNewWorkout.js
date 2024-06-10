const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");

const createNewWorkoutAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);

  const responce = await apiService.initialNewTraining(userName);
  botHelper.resetUserPath(userName);

  switch (responce.status) {
    case "succes":
      ctx.reply("Новая тренировка успешно создана");
      return;

    case "exist":
      ctx.reply("Актуальная тренировка еще не закончена");
      return;

    case "error":
      return new Error("error");
    default:
      return new Error("unexpected error");
  }
};

module.exports = { createNewWorkoutAction };
