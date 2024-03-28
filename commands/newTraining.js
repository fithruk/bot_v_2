const { apiService } = require("../apiService/apiService");
const userState = require("../userState/userState");
const { User } = require("../user/user");
const {
  checkUserName,
  questionTitlesForNewSet,
  historyDestroyer,
} = require("../helpers/helpers");

const newTrainingCommand = async (ctx) => {
  const userName = checkUserName(ctx);

  const { isExist } = await apiService.findUser(userName);
  if (!isExist)
    return ctx.reply("Необходима регистрация, выполните команду '/start'");
  // const newUser = new User(userName, questionTitlesForNewSet);

  // userState.addNewUser(newUser);
  const responce = await apiService.initialNewTraining(userName);
  switch (responce.status) {
    case "succes":
      await historyDestroyer(ctx);
      return ctx.reply("Новая тренировка успешно создана");

    case "exist":
      await historyDestroyer(ctx);
      return ctx.reply("Актуальная тренировка еще не закончена");

    case "error":
      await historyDestroyer(ctx);
      return ctx.reply("error");
    default:
      return ctx.reply("unexpected error");
  }
};

module.exports = { newTrainingCommand };
