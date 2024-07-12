const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");
const HtmlResponce = require("../../../htmlResponce/responce");
const Communicator = require("../../../communicator/communicator");

const closeWorkoutAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const htmlResponce = new HtmlResponce(ctx);
  botHelper.resetUserPath(userName);
  try {
    const { currentUserSession } = await apiService.getCurrentTraining(
      userName
    );
    if (currentUserSession) {
      const { data, status } = await apiService.closeCurrentTraining(userName);
      if (status != 200) {
        return new Error("Somethink went wrong");
      }

      await htmlResponce.reportOfFinishedWorkout(data);
    } else {
      new Communicator(ctx).reply("У вас нет активной тренировки.");
    }
  } catch (error) {
    return new Error(error.message);
  }
};

module.exports = { closeWorkoutAction };
