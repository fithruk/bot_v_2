const {
  markupReplier,
  startOptions,
  questionTitlesForNewSet,
  checkUserName,
} = require("../helpers/helpers");
const { User } = require("../user/user");
const userState = require("../userState/userState");

const startCommand = async (ctx) => {
  const userName = checkUserName(ctx);
  try {
    userState.addNewUser(new User(userName, questionTitlesForNewSet)); // Создаю образ юзера
    await markupReplier(ctx, "Выберите опцию :", startOptions, "typeOfAction");
  } catch (error) {
    console.log(error.message);
    console.log("error in startComand");
  }
};

module.exports = { startCommand };
