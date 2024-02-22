const { apiService } = require("../../apiService/apiService");
const { checkUserNameFromCallbackQuery } = require("../../helpers/helpers");
const HtmlRecponce = require("../../htmlResponce/responce");

const removeExistingSetAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const { currentUserSession } = await apiService.getCurrentTraining(userName);
  const removeResponce = new HtmlRecponce(ctx);
  const exerciseArray = [...currentUserSession.exercises].sort(
    (a, b) => b.numberOfSet - a.numberOfSet
  );

  const uniqueExercises = exerciseArray.reduce(
    (acc, next) => {
      let exercise = acc.find((ex) => ex.exercise == next.exercise);
      if (!exercise) {
        return acc.concat(next);
      }
      if (exercise && exercise.numberOfSet < next.numberOfSet) {
        return acc.concat(next);
      }
      return acc;
    },
    [exerciseArray[0]]
  );
  await removeResponce.removeSetResponce(uniqueExercises);
};

module.exports = { removeExistingSetAction };
