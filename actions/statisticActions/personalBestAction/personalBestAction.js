const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");
const userState = require("../../../userState/userState");
const HtmlResponce = require("../../../htmlResponce/responce");

const personalBestAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const currentUser = userState.findUser(userName);
  try {
    const { data, status } = await apiService.getAbsRecords(userName);
    currentUser.resetPath();
    await new HtmlResponce(ctx).absRecordsResponce(data);
  } catch (error) {
    console.log("error in personalBestAction = async (ctx)");
    return new Error("Somethink went wrong...");
  }
};

module.exports = { personalBestAction };
