const botHelper = require("../../helpers/helpers");
const Communicator = require("../../communicator/communicator");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

const abortUserAnswerData = (user) => {
  user.abortUserAnswerData();
};

const userAnswerKeysEnum = {
  currentGroup: "currentGroup",
  subGroup: "subGroup",
  exersice: "exersice",
  countOfReps: "countOfReps",
  weightOfequipment: "weightOfequipment",
};

const addNewSetAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const callbackQuery = ctx.callbackQuery.data;
  const currentUser = userState.findUser(userName);
  const communicator = new Communicator(ctx);
  const isApprovedCurrentLabel = (key, userUnswers) => {
    return userUnswers[key] != null ? true : false;
  };

  if (currentUser.getUserCopy().currentLabel === 4) {
    const tempUser = currentUser.getUserCopy();
    currentUser.currentLabel = 3;
    currentUser.answers.currentGroup = tempUser.answers.currentGroup;
    currentUser.answers.subGroup = tempUser.answers.subGroup;
    currentUser.answers.exersice = tempUser.answers.exersice;
    currentUser.path = tempUser.path.split("/").slice(0, 4).join("/");
    currentUser.resetUserCopy();
    currentUser.label = currentUser.questionTitles[currentUser.currentLabel];
  }
  let groupes,
    subGroup,
    exersicesBySubGroupe,
    exercise,
    countOfReps = new Array(30).fill(1).map((_, ind) => (ind += 1));

  await botHelper.historyDestroyer(ctx);
  switch (currentUser.label) {
    case botHelper.getQuestionTitlesForNewSet()[0]:
      groupes = await apiService.getAllMusclesGroupes();
      await communicator.markupReplier(
        currentUser.label,
        groupes,
        userAnswerKeysEnum.currentGroup
      ); // Рефакторить

      currentUser.updateCurrentLabel();

      break;

    case botHelper.getQuestionTitlesForNewSet()[1]:
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

      await communicator.markupReplier(
        currentUser.label,
        subGroup,
        userAnswerKeysEnum.subGroup
      );

      currentUser.updateCurrentLabel();
      break;

    case botHelper.getQuestionTitlesForNewSet()[2]:
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

      await communicator.markupReplier(
        currentUser.label,
        exersicesBySubGroupe,
        userAnswerKeysEnum.exersice
      );

      currentUser.updateCurrentLabel();
      break;

    case botHelper.getQuestionTitlesForNewSet()[3]:
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

      await communicator.markupReplier(
        currentUser.label,
        countOfReps,
        userAnswerKeysEnum.countOfReps
      );
      currentUser.updateCurrentLabel();
      break;

    case botHelper.getQuestionTitlesForNewSet()[4]:
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

      await communicator.reply(currentUser.label);
      break;

    default:
      break;
  }
};

const finishNewSetAction = async (ctx, currentUser, message) => {
  const communicator = new Communicator(ctx);

  // Придумать как сбросить данные на последнем шаге, как нибудь потом
  try {
    const callback = botHelper.callbackCreator(
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
    currentUser.saveDataForProceedCurrentEx(currentUser);
    abortUserAnswerData(currentUser);
    await botHelper.historyDestroyer(ctx);
    await communicator.markupReplier(
      "Подход успешно сохранен!\nЧто бы выбрать новое упражнение выполните \t'/new_set'\nДобавить новый подход в текущее упражнение? ",
      [botHelper.getButtonsLabelsForNewSetCommand()[2]],
      "typeOfAction"
    );
  } catch (error) {
    console.log("Error in bot.on'message', during finish exersice");
    console.log(error.message);
  }
};

module.exports = { addNewSetAction, finishNewSetAction };
