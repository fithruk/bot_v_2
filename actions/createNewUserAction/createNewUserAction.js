const {
  checkUserName,
  checkUserNameFromCallbackQuery,
  registrationQuestions,
  callbackCreator,
  historyDestroyer,
} = require("../../helpers/helpers");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

const createNewUserAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  const currentUser = userState.findUser(userName);
  switch (currentUser.label) {
    case registrationQuestions[0]:
      await ctx.reply(currentUser.label);

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
  [registrationQuestions[0], "name"],
  [registrationQuestions[1], "email"],
  [registrationQuestions[2], "phone"],
]);

const saveUserRegStepToStore = (regAnswerKeysEnam, currentUser, message) => {
  if (regAnswerKeysEnam.has(currentUser.label)) {
    currentUser.updateUnswers(
      callbackCreator(regAnswerKeysEnam.get(currentUser.label), message)
    );
    currentUser.updateCurrentLabel();
  }
};

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(phoneNumber) {
  const re = /^\+380\d{9}$/;
  return re.test(phoneNumber);
}

const finishNewUserRegistration = async (ctx, message) => {
  const userName = checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  await historyDestroyer(ctx);

  switch (currentUser.label) {
    case registrationQuestions[0]:
      const [firstName, lastName] = message.split(" ");
      console.log(isNaN(+firstName));
      if (!firstName || !lastName)
        return ctx.reply("Введите имя и фамилию в два слова!");
      if (!isNaN(+firstName) || !isNaN(+lastName)) {
        return ctx.reply(
          "Введите имя и фамилию буквами, только если вы не r2-d2)"
        );
      }

      saveUserRegStepToStore(regAnswerKeysEnam, currentUser, message);
      await ctx.reply(currentUser.label);
      break;
    case registrationQuestions[1]:
      if (!validateEmail(message))
        return ctx.reply(
          "Недействительный адрес электронной почты.Повторите потытку и введите валидный адрес!"
        );
      saveUserRegStepToStore(regAnswerKeysEnam, currentUser, message);
      await ctx.reply(currentUser.label);
      break;
    case registrationQuestions[2]:
      if (!validatePhoneNumber(message)) {
        return ctx.reply(
          "Введите валидный номер телефона в указанном формате!"
        );
      }
      saveUserRegStepToStore(regAnswerKeysEnam, currentUser, message);
      console.log(currentUser.answers);
      currentUser.resetCurrentLabel();
      currentUser.resetPath();
      currentUser.resetUnswers();
      await ctx.reply("Jopa");
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
