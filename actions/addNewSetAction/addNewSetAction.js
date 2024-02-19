const {
  markupReplier,
  checkUserNameFromCallbackQuery,
  questionTitlesForNewSet,
} = require("../../helpers/helpers");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

const addNewSetAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const callbackQuery = ctx.callbackQuery.data;
  const currentUser = userState.findUser(userName);

  let groupes,
    exersice,
    countOfReps = new Array(30).fill(1).map((_, ind) => (ind += 1));

  switch (currentUser.label) {
    case questionTitlesForNewSet[0]:
      groupes = await apiService.getAllMusclesGroupes();
      await markupReplier(ctx, currentUser.label, groupes, "currentGroup"); // Рефакторить
      currentUser.updateCurrentLabel();

      break;

    case questionTitlesForNewSet[1]:
      currentUser.updateUnswers(callbackQuery);
      exersice = await apiService.getExercisesByGroupe(
        currentUser.answers.currentGroup
      );

      await markupReplier(ctx, currentUser.label, exersice, "exersice");
      currentUser.updateCurrentLabel();
      break;

    case questionTitlesForNewSet[2]:
      currentUser.updateUnswers(callbackQuery);
      await markupReplier(ctx, currentUser.label, countOfReps, "countOfReps");
      currentUser.updateCurrentLabel();
      break;

    case questionTitlesForNewSet[3]:
      currentUser.updateUnswers(callbackQuery);
      await ctx.reply(currentUser.label);
      break;

    default:
      break;
  }
};

module.exports = { addNewSetAction };
