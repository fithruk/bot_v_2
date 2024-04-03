const {
  markupReplier,
  checkUserNameFromCallbackQuery,
  questionTitlesForNewSet,
  callbackCreator,
  historyDestroyer,
} = require("../../helpers/helpers");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

const abortUserAnswerData = (user) => {
  user.resetPath();
  user.resetUnswers();
  user.resetCurrentLabel();
};

const userAnswerKeysEnum = {
  currentGroup: "currentGroup",
  subGroup: "subGroup",
  exersice: "exersice",
  countOfReps: "countOfReps",
  weightOfequipment: "weightOfequipment",
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

  await historyDestroyer(ctx);
  switch (currentUser.label) {
    case questionTitlesForNewSet[0]:
      groupes = await apiService.getAllMusclesGroupes();

      await markupReplier(
        ctx,
        currentUser.label,
        groupes,
        userAnswerKeysEnum.currentGroup
      ); // Рефакторить

      currentUser.updateCurrentLabel();

      break;

    case questionTitlesForNewSet[1]:
      currentUser.updateUnswers(callbackQuery);
      if (
        !isApprovedCurrentLabel(
          userAnswerKeysEnum.currentGroup,
          currentUser.answers
        )
      ) {
        abortUserAnswerData(currentUser);
        return new Error(
          "Нарушен проядок выполнения запросов, попробуйте еще раз"
        );
      }

      subGroup = await apiService.getExercisesSubGroupe(
        currentUser.answers.currentGroup
      );

      await markupReplier(
        ctx,
        currentUser.label,
        subGroup,
        userAnswerKeysEnum.subGroup
      );

      currentUser.updateCurrentLabel();
      break;

    case questionTitlesForNewSet[2]:
      currentUser.updateUnswers(callbackQuery);
      if (
        !isApprovedCurrentLabel(
          userAnswerKeysEnum.subGroup,
          currentUser.answers
        )
      ) {
        abortUserAnswerData(currentUser);
        return new Error(
          "Нарушен проядок выполнения запросов, попробуйте еще раз"
        );
      }

      exersicesBySubGroupe = await apiService.getApartExerciseBySubGroup(
        currentUser.answers.currentGroup,
        currentUser.answers.subGroup
      );

      await markupReplier(
        ctx,
        currentUser.label,
        exersicesBySubGroupe,
        userAnswerKeysEnum.exersice
      );

      currentUser.updateCurrentLabel();
      break;

    case questionTitlesForNewSet[3]:
      currentUser.updateUnswers(callbackQuery);
      if (
        !isApprovedCurrentLabel(
          userAnswerKeysEnum.exersice,
          currentUser.answers
        )
      ) {
        abortUserAnswerData(currentUser);
        return new Error(
          "Нарушен проядок выполнения запросов, попробуйте еще раз"
        );
      }

      await markupReplier(
        ctx,
        currentUser.label,
        countOfReps,
        userAnswerKeysEnum.countOfReps
      );
      currentUser.updateCurrentLabel();
      break;

    case questionTitlesForNewSet[4]:
      currentUser.updateUnswers(callbackQuery);
      if (
        !isApprovedCurrentLabel(
          userAnswerKeysEnum.countOfReps,
          currentUser.answers
        )
      ) {
        abortUserAnswerData(currentUser);
        return new Error(
          "Нарушен проядок выполнения запросов, попробуйте еще раз"
        );
      }

      await ctx.reply(currentUser.label);
      break;

    default:
      break;
  }
};

const finishNewSetAction = async (ctx, currentUser, message) => {
  // Придумать как сбросить данные на последнем шаге, как нибудь потом
  try {
    const callback = callbackCreator(
      userAnswerKeysEnum.weightOfequipment,
      +message
    );
    currentUser.updateUnswers(callback);
    await apiService.updateTrainingPerfomance(
      currentUser.userName,
      currentUser.answers.exersice,
      currentUser.answers.countOfReps,
      currentUser.answers.weightOfequipment
    );
    abortUserAnswerData(currentUser);
    await historyDestroyer(ctx);
    ctx.reply("Подход успешно сохранен!");
  } catch (error) {
    console.log("Error in bot.on'message', during finish exersice");
    console.log(error.message);
  }
};

module.exports = { addNewSetAction, finishNewSetAction };
