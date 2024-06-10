const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");
const HtmlResponce = require("../../../htmlResponce/responce");

const personalBestAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);

  try {
    const { data, status } = await apiService.getAbsRecords(userName);
    botHelper.resetUserPath(userName);
    await new HtmlResponce(ctx).absRecordsResponce(data);
  } catch (error) {
    console.log("error in personalBestAction = async (ctx)");
    return new Error("Somethink went wrong...");
  }
};

module.exports = { personalBestAction };
