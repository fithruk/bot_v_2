const { apiService } = require("../apiService/apiService");
const Communicator = require("../communicator/communicator");
const botHelper = require("../helpers/helpers");

const workoutsCommand = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);
  const communicator = new Communicator(ctx);
  const { isExist } = await apiService.findUser(userName);
  if (!isExist)
    return communicator.reply(
      "Необходима регистрация, выполните команду '/start'"
    );

  await communicator.markupReplier(
    "Выберите нужную опцию :",
    botHelper.getWorkoutOptions().slice(0, 4),
    "typeOfAction"
  );
};

module.exports = { workoutsCommand };
