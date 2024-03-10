const {
  checkUserName,
  markupReplier,
  buttonsLabelsForNewSetCommand,
  historyDestroyer,
} = require("../helpers/helpers");

const { apiService } = require("../apiService/apiService");

const newSetCommand = async (ctx) => {
  const userName = checkUserName(ctx);

  try {
    const { status } = await apiService.isTrainingExist(userName);

    if (!status) return ctx.reply("У вас нет активной тренировки");

    // Надо порефакторить

    await historyDestroyer(ctx, ctx.message.message_id);
    await markupReplier(
      ctx,
      "Выберите функцию :",
      buttonsLabelsForNewSetCommand,
      "typeOfAction"
    ); // Вынести ключ в енам ключей, использовать как элемент path в объекте юзера
  } catch (error) {
    console.log("Error in 'newSetCommand'");
    console.log(error.message);
  }
};

module.exports = { newSetCommand };
