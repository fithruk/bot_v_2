const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");

const getCurrentWorkoutAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);

  console.log(userName);
};

module.exports = { getCurrentWorkoutAction };
