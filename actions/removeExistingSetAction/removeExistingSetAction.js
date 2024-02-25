const { apiService } = require("../../apiService/apiService");
const {
  checkUserNameFromCallbackQuery,
  checkUserName,
} = require("../../helpers/helpers");
const userState = require("../../userState/userState");
const HtmlRecponce = require("../../htmlResponce/responce");

const removeExistingSetAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const currentUser = userState.findUser(userName);
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

  currentUser.setExercisesForForcedUpdateInDB(Object.entries(uniqueExercises));

  await removeResponce.removeSetResponce(Object.entries(uniqueExercises));
};
//Here...
const finishRemoveSetAction = async (ctx, message) => {
  if (!message.includes("-")) return console.log("Wrong data");
  const userName = checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  const [numOfExercise, numOfSet] = message.split("-");

  const idOfSet = currentUser.exercisesForcedUpdate(+numOfExercise, +numOfSet);
  // Here...
};

module.exports = { removeExistingSetAction, finishRemoveSetAction };
