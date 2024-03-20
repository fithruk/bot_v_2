const { checkUserName } = require("../helpers/helpers");
const { apiService } = require("../apiService/apiService");
//Here...
const registrationOfNewUserComand = async (ctx) => {
  const userName = checkUserName(ctx);
  const data = await apiService.findUser(userName);
  console.log(data);
};

module.exports = { registrationOfNewUserComand };
