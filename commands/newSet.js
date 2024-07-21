const botHelper = require("../helpers/helpers");
const Communicator = require("../communicator/communicator");
const userState = require("../userState/userState");
const { apiService } = require("../apiService/apiService");

const newSetCommand = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);
  const communicator = new Communicator(ctx);
  const currentUser = userState.findUser(userName);
  currentUser.abortUserAnswerData();
  currentUser.resetUserCopy();

  try {
    const { isExist } = await apiService.findUser(userName);
    const { status } = await apiService.isTrainingExist(userName);

    if (!isExist)
      return communicator.reply(
        "Необходима регистрация, выполните команду '/start'"
      );
    if (!status) return communicator.reply("У вас нет активной тренировки");

    // Надо порефакторить

    await botHelper.historyDestroyer(ctx);
    await communicator.markupReplier(
      "Выберите функцию :",
      botHelper.getButtonsLabelsForNewSetCommand().slice(0, 2),
      "typeOfAction"
    ); // Вынести ключ в енам ключей, использовать как элемент path в объекте юзера
  } catch (error) {
    console.log("Error in 'newSetCommand'");
    console.log(error.message);
  }
};

module.exports = { newSetCommand };
