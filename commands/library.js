const botHelper = require("../helpers/helpers");
const Communicator = require("../communicator/communicator");
const { apiService } = require("../apiService/apiService");

const getLibrary = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);
  const communicator = new Communicator(ctx);
  try {
    await botHelper.historyDestroyer(ctx);
    await communicator.markupReplier(
      "Данные которые нужно загрузить :",
      botHelper.getLibraryOptions(),
      "typeOfAction"
    ); // Вынести ключ в енам ключей, использовать как элемент path в объекте юзера
  } catch (error) {
    console.log("Error in 'getLibrary'");
    console.log(error);
  }
};

module.exports = { getLibrary };
