const { apiService } = require("../apiService/apiService");

const botHelper = require("../helpers/helpers");

const workoutsCommand = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);

  const { isExist } = await apiService.findUser(userName);
  if (!isExist)
    return ctx.reply("Необходима регистрация, выполните команду '/start'");

  await botHelper.markupReplier(
    ctx,
    "Выберите нужную опцию :",
    botHelper.getWorkoutOptions(),
    "typeOfAction"
  );
};

module.exports = { workoutsCommand };
