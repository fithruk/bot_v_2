const botHelper = require("../../helpers/helpers");
const Communicator = require("../../communicator/communicator");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

const regAnswers = { name: null, email: null, phone: null };

const createNewUserAction = async (ctx) => {
  const communicator = new Communicator(ctx);
  const userName = botHelper.checkUserNameFromCallbackQuery(ctx);
  const currentUser = userState.findUser(userName);

  const { isExist } = await apiService.findUser(userName);

  if (isExist) {
    botHelper.resetUserPath(userName);
    return communicator.reply(
      `Юзер никнеймом ${userName.split("-")[0]} уже создан`
    );
  }

  currentUser.setUnswers(regAnswers);

  switch (currentUser.label) {
    case botHelper.getRegistrationQuestions()[0]:
      await communicator.reply(currentUser.label);

      break;

    default:
      break;
  }
  try {
  } catch (error) {
    console.log("error in registrationOfNewUserComand");
    console.log(error.message);
  }
};

const regAnswerKeysEnam = new Map([
  [botHelper.getRegistrationQuestions()[0], "name"],
  [botHelper.getRegistrationQuestions()[1], "email"],
  [botHelper.getRegistrationQuestions()[2], "phone"],
]);

const saveUserRegStepToStore = (regAnswerKeysEnam, currentUser, message) => {
  if (regAnswerKeysEnam.has(currentUser.label)) {
    currentUser.updateUnswers(
      botHelper.callbackCreator(
        regAnswerKeysEnam.get(currentUser.label),
        message
      )
    );
    currentUser.updateCurrentLabel();
  }
};

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(phoneNumber) {
  const re = /^380\d{9}$/;
  return re.test(phoneNumber);
}

const finishNewUserRegistration = async (ctx, message) => {
  const userName = botHelper.checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  const communicator = new Communicator(ctx);
  await botHelper.historyDestroyer(ctx);

  switch (currentUser.label) {
    case botHelper.getRegistrationQuestions()[0]:
      const [firstName, lastName] = message.split(" ");
      if (!firstName || !lastName)
        return communicator.reply("Введите имя и фамилию в два слова!");
      if (!isNaN(+firstName) || !isNaN(+lastName)) {
        return communicator.reply(
          "Введите имя и фамилию буквами, только если вы не r2-d2)"
        );
      }

      saveUserRegStepToStore(regAnswerKeysEnam, currentUser, message);
      await communicator.reply(currentUser.label);
      break;
    case botHelper.getRegistrationQuestions()[1]:
      if (!validateEmail(message))
        return communicator.reply(
          "Недействительный адрес электронной почты.Повторите потытку и введите валидный адрес!"
        );
      saveUserRegStepToStore(regAnswerKeysEnam, currentUser, message);
      await communicator.reply(currentUser.label);
      break;
    case botHelper.getRegistrationQuestions()[2]:
      if (!validatePhoneNumber(message)) {
        return communicator.reply(
          "Введите валидный номер телефона в указанном формате: 380XXXXXXXX"
        );
      }
      saveUserRegStepToStore(regAnswerKeysEnam, currentUser, message);

      const response = await apiService.createUser(
        userName,
        currentUser.answers
      );

      botHelper.resetUserPath(userName);
      currentUser.resetUnswers();
      currentUser.setQuestions(botHelper.getQuestionTitlesForNewSet());
      currentUser.setUnswers(botHelper.getAnswersForNewSet());
      currentUser.resetCurrentLabel();
      await communicator.reply(response);
      break;

    default:
      break;
  }
  try {
  } catch (error) {
    console.log("error in registrationOfNewUserComand");
    console.log(error.message);
  }
};

module.exports = { createNewUserAction, finishNewUserRegistration };
