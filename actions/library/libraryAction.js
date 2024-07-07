const botHelper = require("../../helpers/helpers");
const Communicator = require("../../communicator/communicator");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

const userAnswerKeysEnum = {
  currentGroup: "currentGroup",
  subGroup: "subGroup",
  exersice: "exersice",
};

const abortUserAnswerData = (user) => {
  user.resetPath();
  user.resetUnswers();
  user.resetCurrentLabel();
};

const getLibraryAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const callbackQuery = ctx.callbackQuery.data;
  const currentUser = userState.findUser(userName);
  const communicator = new Communicator(ctx);
  const isApprovedCurrentLabel = (key, userUnswers) => {
    return userUnswers[key] != null ? true : false;
  };

  let groupes, subGroup, exersicesBySubGroupe, exercise;

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

      const [_, groupe, subGroupe, exersice] = currentUser.path.split("/");

      let { data: imgUrl } = await apiService.loadExImage(
        groupe,
        subGroupe,
        exersice
      );

      const { data: exerciseDescription } =
        await apiService.loadDescriptionOfExersice(exersice);

      botHelper.resetUserPath(userName);
      abortUserAnswerData(currentUser);
      await botHelper.historyDestroyer(ctx);
      await communicator.libraryReplyer(imgUrl, exersice, exerciseDescription);

      break;

    default:
      break;
  }
};

module.exports = { getLibraryAction };
