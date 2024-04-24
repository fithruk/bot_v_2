const botHelper = require("../helpers/helpers");

const { apiService } = require("../apiService/apiService");

const getStat = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);

  try {
    const { isExist } = await apiService.findUser(userName);

    if (!isExist)
      return ctx.reply("Необходима регистрация, выполните команду '/start'");

    await botHelper.historyDestroyer(ctx);
    await botHelper.markupReplier(
      ctx,
      "Данные которые нужно загрузить :",
      ["Личные рекорды", "Кол-во тренировок за период"],
      "typeOfAction"
    ); // Вынести ключ в енам ключей, использовать как элемент path в объекте юзера
  } catch (error) {
    console.log("Error in 'newSetCommand'");
    console.log(error.message);
  }
};

module.exports = { getStat };
