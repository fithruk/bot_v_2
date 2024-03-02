const {
  markupReplier,
  checkUserNameFromCallbackQuery,
  questionTitlesForNewSet,
  callbackCreator,
} = require("../../helpers/helpers");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

const addNewSetAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const callbackQuery = ctx.callbackQuery.data;
  const currentUser = userState.findUser(userName);

  const isApprovedCurrentLabel = (key, userUnswers) => {
    return userUnswers[key] != null ? true : false;
  };

  const abortUserAnswerData = (user) => {
    user.resetPath();
    user.resetUnswers();
    user.resetCurrentLabel();
  };

  let groupes,
    exersice,
    countOfReps = new Array(30).fill(1).map((_, ind) => (ind += 1));
  // Сделать валидацию по отображению и обновлению кнопок
  switch (currentUser.label) {
    case questionTitlesForNewSet[0]:
      groupes = await apiService.getAllMusclesGroupes();
      await markupReplier(ctx, currentUser.label, groupes, "currentGroup"); // Рефакторить

      currentUser.updateCurrentLabel(true);

      break;

    case questionTitlesForNewSet[1]:
      currentUser.updateUnswers(callbackQuery);
      if (!isApprovedCurrentLabel("currentGroup", currentUser.answers))
        return abortUserAnswerData(currentUser);

      exersice = await apiService.getExercisesByGroupe(
        currentUser.answers.currentGroup
      );

      await markupReplier(ctx, currentUser.label, exersice, "exersice");

      currentUser.updateCurrentLabel(true);
      break;

    case questionTitlesForNewSet[2]:
      currentUser.updateUnswers(callbackQuery);
      if (!isApprovedCurrentLabel("exersice", currentUser.answers))
        return abortUserData(currentUser);

      await markupReplier(ctx, currentUser.label, countOfReps, "countOfReps");
      currentUser.updateCurrentLabel(true);
      break;

    case questionTitlesForNewSet[3]:
      currentUser.updateUnswers(callbackQuery);
      if (!isApprovedCurrentLabel("countOfReps", currentUser.answers))
        return abortUserAnswerData(currentUser);

      await ctx.reply(currentUser.label);
      break;

    default:
      break;
  }
};

const finishNewSetAction = async (ctx, currentUser, message) => {
  // Придумать как сбросить данные на последнем шаге
  try {
    const callback = callbackCreator("weightOfequipment", +message);
    currentUser.updateUnswers(callback);
    await apiService.updateTrainingPerfomance(
      currentUser.userName,
      currentUser.answers.exersice,
      currentUser.answers.countOfReps,
      currentUser.answers.weightOfequipment
    );
    currentUser.resetUnswers();
    currentUser.resetCurrentLabel();
    currentUser.resetPath();
    ctx.reply("Подход успешно сохранен!");
  } catch (error) {
    console.log("Error in bot.on'message', during finish exersice");
    console.log(error.message);
  }
};

module.exports = { addNewSetAction, finishNewSetAction };
