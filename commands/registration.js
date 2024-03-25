const { checkUserName } = require("../helpers/helpers");
const { apiService } = require("../apiService/apiService");
//Here...
const registrationOfNewUserComand = async (ctx) => {
  const userName = checkUserName(ctx);
  try {
    const { id } = await apiService.findUser(userName);
    if (!id) {
      console.log("registration script");
    }
  } catch (error) {
    console.log("error in registrationOfNewUserComand");
    console.log(error.message);
  }
};

module.exports = { registrationOfNewUserComand };
