const { apiService } = require("../../../apiService/apiService");
const userState = require("../../../userState/userState");
const botHelper = require("../../../helpers/helpers");

const closeWorkoutAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const currentUser = userState.findUser(userName);
  currentUser.resetPath();
  try {
    const { currentUserSession } = await apiService.getCurrentTraining(
      userName
    );
    if (currentUserSession) {
      const { data, status } = await apiService.closeCurrentTraining(userName);
      if (status != 200) {
        return new Error("Somethink went wrong");
      }
      ctx.reply(data);
    } else {
      ctx.reply("У вас нет активной тренировки.");
    }
  } catch (error) {
    return new Error(error.message);
  }
};

module.exports = { closeWorkoutAction };
