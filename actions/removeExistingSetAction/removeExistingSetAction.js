const { apiService } = require("../../apiService/apiService");
const { checkUserNameFromCallbackQuery } = require("../../helpers/helpers");
const HtmlRecponce = require("../../htmlResponce/responce");

const removeExistingSetAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const { currentUserSession } = await apiService.getCurrentTraining(userName);
  const removeResponce = new HtmlRecponce(ctx);

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

  await removeResponce.removeSetResponce(Object.entries(uniqueExercises));
};

module.exports = { removeExistingSetAction };
