const {
  markupReplier,
  checkUserNameFromCallbackQuery,
  questionTitlesForNewSet,
  callbackCreator,
} = require("../../helpers/helpers");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

const abortUserAnswerData = (user) => {
  user.resetPath();
  user.resetUnswers();
  user.resetCurrentLabel();
};

const addNewSetAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const callbackQuery = ctx.callbackQuery.data;
  const currentUser = userState.findUser(userName);

  const isApprovedCurrentLabel = (key, userUnswers) => {
    return userUnswers[key] != null ? true : false;
  };

  let groupes,
    subGroup,
    exersicesBySubGroupe,
    exercise,
    countOfReps = new Array(30).fill(1).map((_, ind) => (ind += 1));

  switch (currentUser.label) {
    case questionTitlesForNewSet[0]:
      groupes = await apiService.getAllMusclesGroupes();
      await markupReplier(ctx, currentUser.label, groupes, "currentGroup"); // Рефакторить

      currentUser.updateCurrentLabel();

      break;

    case questionTitlesForNewSet[1]:
      currentUser.updateUnswers(callbackQuery);
      if (!isApprovedCurrentLabel("currentGroup", currentUser.answers))
        return abortUserAnswerData(currentUser);

      subGroup = await apiService.getExercisesSubGroupe(
        currentUser.answers.currentGroup
      );

      await markupReplier(ctx, currentUser.label, subGroup, "subGroup");

      currentUser.updateCurrentLabel();
      break;

    case questionTitlesForNewSet[2]:
      currentUser.updateUnswers(callbackQuery);
      if (!isApprovedCurrentLabel("subGroup", currentUser.answers))
        return abortUserAnswerData(currentUser);

      exersicesBySubGroupe = await apiService.getApartExerciseBySubGroup(
        currentUser.answers.currentGroup,
        currentUser.answers.subGroup
      );

      await markupReplier(
        ctx,
        currentUser.label,
        exersicesBySubGroupe,
        "exersice"
      );

      currentUser.updateCurrentLabel();
      break;

    case questionTitlesForNewSet[3]:
      currentUser.updateUnswers(callbackQuery);
      if (!isApprovedCurrentLabel("exersice", currentUser.answers))
        return abortUserAnswerData(currentUser);

      await markupReplier(ctx, currentUser.label, countOfReps, "countOfReps");
      currentUser.updateCurrentLabel();
      break;

    case questionTitlesForNewSet[4]:
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
  // Придумать как сбросить данные на последнем шаге, как нибудь потом
  try {
    const callback = callbackCreator("weightOfequipment", +message);
    currentUser.updateUnswers(callback);
    await apiService.updateTrainingPerfomance(
      currentUser.userName,
      currentUser.answers.exersice,
      currentUser.answers.countOfReps,
      currentUser.answers.weightOfequipment
    );
    abortUserAnswerData(currentUser);

    ctx.reply("Подход успешно сохранен!");
  } catch (error) {
    console.log("Error in bot.on'message', during finish exersice");
    console.log(error.message);
  }
};

module.exports = { addNewSetAction, finishNewSetAction };
