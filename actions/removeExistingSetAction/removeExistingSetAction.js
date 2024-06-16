const { apiService } = require("../../apiService/apiService");
const botHelper = require("../../helpers/helpers");
const Communicator = require("../../communicator/communicator");
const userState = require("../../userState/userState");
const HtmlResponce = require("../../htmlResponce/responce");

const removeExistingSetAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
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

    await botHelper.historyDestroyer(ctx);
    if (exerciseArray.length == 0) {
      botHelper.resetUserPath(userName);
      return new Error("В текущей тренировке еще ничего не было выполнено.");
    }

    await removeResponce.removeSetResponce(Object.entries(uniqueExercises));
  } catch (error) {
    console.log(error.message);
  }
};

const finishRemoveSetAction = async (ctx, message) => {
  const communicator = new Communicator(ctx);
  if (!message.includes("-")) {
    console.log("Wrong data");
    return new Error(
      "Укажите сообщение в формате : номер упражения - номер подхода"
    );
  }
  const userName = botHelper.checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  const [numOfExercise, numOfSet] = message.split("-");
  console.log(numOfExercise, numOfSet);
  const id = currentUser.exerciseIdFordelete(+numOfExercise, +numOfSet);
  if (id) {
    try {
      await apiService.removeSet(userName, id);
      botHelper.resetUserPath(userName);
      await botHelper.historyDestroyer(ctx);
      communicator.reply("Подход успешно удален.");
    } catch (error) {
      botHelper.resetUserPath(userName);
      console.log("Error during removeExistingSetAction");
      console.log(error.message);
    }
  } else {
    communicator.reply(
      "Нет такого подхода!\nПопробуйте повторить операцию сначала"
    );
    botHelper.historyDestroyer(ctx);
    botHelper.resetUserPath(userName);
  }
};

module.exports = { removeExistingSetAction, finishRemoveSetAction };
