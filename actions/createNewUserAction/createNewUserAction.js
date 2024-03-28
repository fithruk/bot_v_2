const {
  checkUserName,
  checkUserNameFromCallbackQuery,
} = require("../../helpers/helpers");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

const registrationQuestions = [
  "Введите имя ",
  "Введите фамилию ",
  "Введите рост",
];
//Here...
const createNewUserAction = async (ctx) => {
  const userName = checkUserNameFromCallbackQuery(ctx);
  //userState.viewStore();

  try {
  } catch (error) {
    console.log("error in registrationOfNewUserComand");
    console.log(error.message);
  }
};

const finishNewUserRegistration = (ctx) => {
  console.log(ctx.state);
};

module.exports = { createNewUserAction, finishNewUserRegistration };
