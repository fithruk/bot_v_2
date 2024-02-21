const { apiService } = require("../../apiService/apiService");
const { checkUserNameFromCallbackQuery } = require("../../helpers/helpers");

const removeExistingSetAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const { currentUserSession } = await apiService.getCurrentTraining(userName);
  // Вот тут я застрял
  const exerciseArray = [...currentUserSession.exercises].sort(
    (a, b) => b.numberOfSet - a.numberOfSet
  );

  const uniqueExercises = exerciseArray.reduce((acc, next) => {
    let exercise = acc.find((ex) => ex.exercise == next.exercise);
    // console.log(exercise);
    // console.log(next);
    if (exercise && exercise.numberOfSet < next.numberOfSet) {
      return acc.concat(next);
    }
    return acc;
  }, exerciseArray);
  console.log(uniqueExercises);
};

module.exports = { removeExistingSetAction };
