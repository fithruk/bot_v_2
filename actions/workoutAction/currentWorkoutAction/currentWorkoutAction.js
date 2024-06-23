const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");
const HtmlResponce = require("../../../htmlResponce/responce");
const Communicator = require("../../../communicator/communicator");

const getCurrentWorkoutAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const htmlResponce = new HtmlResponce(ctx);

  try {
    const { currentUserSession } = await apiService.getCurrentTraining(
      userName
    );

    if (!currentUserSession) {
      return new Communicator(ctx).reply("У вас нет активной тренировки");
    }

    const exerciseArray = [...currentUserSession.exercises];

    const uniqueExercises = exerciseArray.reduce(
      (acc, next) => ({ ...acc, [next.exercise]: [] }),
      {}
    );

    exerciseArray.forEach((exercise) => {
      if (uniqueExercises[exercise.exercise]) {
        uniqueExercises[exercise.exercise].push(exercise);
      }
    });

    htmlResponce.currentWorlout(Object.entries(uniqueExercises));
    botHelper.resetUserPath(userName);
  } catch (error) {
    botHelper.resetUserPath(userName);
    return new Error(error.message);
  }
};

module.exports = { getCurrentWorkoutAction };
