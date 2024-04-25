const botHelper = require("../helpers/helpers");
const { apiService } = require("../apiService/apiService");
const { User } = require("../user/user");
const userState = require("../userState/userState");

const regAnswers = { name: null, email: null, phone: null };
//Here...
const startCommand = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  try {
    const { isExist } = await apiService.findUser(userName);

    if (isExist && !currentUser) {
      userState.addNewUser(
        new User(userName, botHelper.getQuestionTitlesForNewSet())
      );
      return await botHelper.markupReplier(
        ctx,
        "Выберите опцию :",
        botHelper
          .getstartOptions()
          .slice(1, botHelper.getstartOptions().length),
        "typeOfAction"
      );
    }
    if (!isExist) {
      userState.addNewUser(
        new User(userName, botHelper.getRegistrationQuestions())
      );
      const currentUser = userState.findUser(userName);
      currentUser.setUnswers(regAnswers);
      return await botHelper.markupReplier(
        ctx,
        "Выберите опцию :",
        botHelper.getstartOptions(),
        "typeOfAction"
      );
    } else {
      return await botHelper.markupReplier(
        ctx,
        "Выберите опцию :",
        botHelper
          .getstartOptions()
          .slice(1, botHelper.getstartOptions().length),
        "typeOfAction"
      );
    }
  } catch (error) {
    console.log(error.message);
    console.log("error in startComand");
  }
};

module.exports = { startCommand };
