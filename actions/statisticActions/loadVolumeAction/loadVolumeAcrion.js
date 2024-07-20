const { apiService } = require("../../../apiService/apiService");
const botHelper = require("../../../helpers/helpers");
const Communicator = require("../../../communicator/communicator");

const loadVolumeAction = async (ctx) => {
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const communicator = new Communicator(ctx);

  try {
    const { data, status } = await apiService.getTonnageStat(userName);
    botHelper.resetUserPath(userName);
    await communicator.reply(data.imgUrl);
  } catch (error) {
    console.log("error in loadVolumeAction = async (ctx)");
    return new Error("Somethink went wrong...");
  }
};

module.exports = { loadVolumeAction };
