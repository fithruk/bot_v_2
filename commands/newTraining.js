const { apiService } = require("../apiService/apiService");

const botHelper = require("../helpers/helpers");

const newTrainingCommand = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);

  const { isExist } = await apiService.findUser(userName);
  if (!isExist)
    return ctx.reply("Необходима регистрация, выполните команду '/start'");

  await botHelper.historyDestroyer(ctx);
  const responce = await apiService.initialNewTraining(userName);
  switch (responce.status) {
    case "succes":
      return ctx.reply("Новая тренировка успешно создана");

    case "exist":
      return ctx.reply("Актуальная тренировка еще не закончена");

    case "error":
      return ctx.reply("error");
    default:
      return ctx.reply("unexpected error");
  }
};

module.exports = { newTrainingCommand };
