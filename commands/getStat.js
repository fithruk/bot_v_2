const botHelper = require("../helpers/helpers");
const Communicator = require("../communicator/communicator");
const { apiService } = require("../apiService/apiService");

const getStat = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);
  const communicator = new Communicator(ctx);
  try {
    const { isExist } = await apiService.findUser(userName);

    if (!isExist)
      return ctx.reply("Необходима регистрация, выполните команду '/start'");

    await botHelper.historyDestroyer(ctx);
    await communicator.markupReplier(
      "Данные которые нужно загрузить :",
      botHelper.getStatOptions(),
      "typeOfAction"
    ); // Вынести ключ в енам ключей, использовать как элемент path в объекте юзера
  } catch (error) {
    console.log("Error in 'newSetCommand'");
    console.log(error);
  }
};

module.exports = { getStat };
