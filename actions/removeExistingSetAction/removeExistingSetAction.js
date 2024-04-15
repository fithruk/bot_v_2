const { apiService } = require("../../apiService/apiService");
const {
  checkUserNameFromCallbackQuery,
  checkUserName,
  historyDestroyer,
} = require("../../helpers/helpers");
const userState = require("../../userState/userState");
const HtmlResponce = require("../../htmlResponce/responce");

const removeExistingSetAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const currentUser = userState.findUser(userName);
  try {
    const { currentUserSession } = await apiService.getCurrentTraining(
      userName
    );
    const removeResponce = new HtmlResponce(ctx);

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

    currentUser.setExercisesForForcedUpdateInDB(
      Object.entries(uniqueExercises)
    );

    await historyDestroyer(ctx);
    if (exerciseArray.length == 0) {
      currentUser.resetPath();
      return new Error("В текущей тренировке еще ничего не было выполнено.");
    }

    await removeResponce.removeSetResponce(Object.entries(uniqueExercises));
  } catch (error) {
    console.log(error.message);
  }
};

const finishRemoveSetAction = async (ctx, message) => {
  if (!message.includes("-")) {
    console.log("Wrong data");
    return new Error(
      "Укажите сообщение в формате : номер упражения - номер подхода"
    );
  }
  const userName = checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  const [numOfExercise, numOfSet] = message.split("-");

  const id = currentUser.exercisesForcedUpdate(+numOfExercise, +numOfSet);
  console.log(id);
  if (id) {
    try {
      await apiService.removeSet(userName, id);
      currentUser.resetPath();
      await historyDestroyer(ctx);
      ctx.reply("Подход успешно удален.");
    } catch (error) {
      currentUser.resetPath();
      console.log("Error during removeExistingSetAction");
      console.log(error.message);
    }
  } else {
    ctx.reply("Нет такого подхода!");
  }
};

module.exports = { removeExistingSetAction, finishRemoveSetAction };
