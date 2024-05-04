const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");

const personalBestAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const data = await apiService.getAbsRecords(userName);
  console.log(data);
};

module.exports = { personalBestAction };
