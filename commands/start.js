const botHelper = require("../helpers/helpers");
const { apiService } = require("../apiService/apiService");
const { User } = require("../user/user");
const userState = require("../userState/userState");

const regAnswers = { name: null, email: null, phone: null };

const startCommand = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);

  try {
    const { isExist } = await apiService.findUser(userName);
    isExist
      ? userState.addNewUser(
          new User(userName, botHelper.getQuestionTitlesForNewSet())
        )
      : userState.addNewUser(
          new User(userName, botHelper.getRegistrationQuestions())
        );

    const currentUser = userState.findUser(userName);
    currentUser.setUnswers(regAnswers);
    await botHelper.markupReplier(
      ctx,
      "Выберите опцию :",
      botHelper.getstartOptions(),
      "typeOfAction"
    );
  } catch (error) {
    console.log(error.message);
    console.log("error in startComand");
  }
};

module.exports = { startCommand };
