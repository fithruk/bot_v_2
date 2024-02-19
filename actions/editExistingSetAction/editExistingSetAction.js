const { apiService } = require("../../apiService/apiService");
const { checkUserNameFromCallbackQuery } = require("../../helpers/helpers");

const editExistingSetAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const { currentUserSession } = await apiService.getCurrentTraining(userName);
  // Вот тут я застрял
  currentUserSession.exercises.map((ex) => console.log(ex));
};

module.exports = { editExistingSetAction };
