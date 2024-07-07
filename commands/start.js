const botHelper = require("../helpers/helpers");
const Communicator = require("../communicator/communicator");
const { apiService } = require("../apiService/apiService");
const { User } = require("../user/user");
const userState = require("../userState/userState");

const regAnswers = { name: null, email: null, phone: null };

const startCommand = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  const communicator = new Communicator(ctx);
  try {
    const { isExist } = await apiService.findUser(userName);

    if (isExist && !currentUser) {
      userState.addNewUser(
        new User(userName, botHelper.getQuestionTitlesForNewSet())
      );
      communicator.reply("Вы были успешно авторизированы.");
      return await communicator.markupReplier(
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
      return await communicator.markupReplier(
        "Выберите опцию :",
        botHelper.getstartOptions(),
        "typeOfAction"
      );
    } else {
      return await communicator.markupReplier(
        "Выберите опцию :",
        botHelper
          .getstartOptions()
          .slice(1, botHelper.getstartOptions().length),
        "typeOfAction"
      );
    }
  } catch (error) {
    console.log("error in startComand");
    console.log(error);
  }
};

module.exports = { startCommand };
