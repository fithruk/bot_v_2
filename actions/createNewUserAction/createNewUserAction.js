const {
  checkUserName,
  checkUserNameFromCallbackQuery,
  registrationQuestions,
} = require("../../helpers/helpers");
const { apiService } = require("../../apiService/apiService");
const userState = require("../../userState/userState");

//Here...
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
//Here...
const finishNewUserRegistration = async (ctx, message) => {
  const userName = checkUserName(ctx);
  const currentUser = userState.findUser(userName);
  console.log(currentUser.answers);
  switch (currentUser.label) {
    case registrationQuestions[0]:
      await ctx.reply(currentUser.label);
      break;
    case registrationQuestions[1]:
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

module.exports = { createNewUserAction, finishNewUserRegistration };
