const {
  markupReplier,
  startOptions,
  questionTitlesForNewSet,
  checkUserName,
  registrationQuestions,
} = require("../helpers/helpers");
const { apiService } = require("../apiService/apiService");
const { User } = require("../user/user");
const userState = require("../userState/userState");

const startCommand = async (ctx) => {
  const userName = checkUserName(ctx);
  try {
    const { isExist } = await apiService.findUser(userName);
    isExist
      ? userState.addNewUser(new User(userName, questionTitlesForNewSet))
      : userState.addNewUser(new User(userName, registrationQuestions));

    if (isExist)
      return ctx.reply(`Юзер никнеймом ${userName.split("-")[0]} уже создан`);
    await markupReplier(ctx, "Выберите опцию :", startOptions, "typeOfAction");
  } catch (error) {
    console.log(error.message);
    console.log("error in startComand");
  }
};

module.exports = { startCommand };
