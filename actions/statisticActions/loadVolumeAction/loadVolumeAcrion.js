const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");
const HtmlResponce = require("../../../htmlResponce/responce");

const loadVolumeAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  //Написать вывод графиков
  try {
    const { data, status } = await apiService.getTonnageStat(userName);
    botHelper.resetUserPath(userName);
    // await new HtmlResponce(ctx).absRecordsResponce(data);
  } catch (error) {
    console.log("error in loadVolumeAction = async (ctx)");
    return new Error("Somethink went wrong...");
  }
};

module.exports = { loadVolumeAction };
