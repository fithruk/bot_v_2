const { apiService } = require("../../../apiService/apiService");
const userState = require("../../../userState/userState");
const botHelper = require("../../../helpers/helpers");

const closeWorkoutAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const currentUser = userState.findUser(userName);
  currentUser.resetPath();
  const { currentUserSession } = await apiService.getCurrentTraining(userName);
  if (currentUserSession) {
    const { data, status } = await apiService.closeCurrentTraining(userName);
    if (status != 200) {
      return new Error("Somethink went wrong");
    }
  } else {
    return new Error("UserSession is undefined");
  }
};

module.exports = { closeWorkoutAction };
