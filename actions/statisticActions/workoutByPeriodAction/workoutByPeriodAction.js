const moment = require("moment");

const workoutByPeriodAction = async (ctx) => {
  try {
    await ctx.reply(
      "Введите даты, в промежутке которых нужно показать данные о предыдущих тренировках, в формате [число/меcяц/год] - [число/меcяц/год]\nНапример 20/08/2024-30/08/2024"
    );
  } catch (error) {
    return new Error(error.message);
  }
};

const finishWorkoutByPeriodAction = async (ctx, message) => {
  if (
    !(
      typeof message == "string" &&
      message.includes("/") &&
      message.includes("-")
    )
  )
    return ctx.reply("Неверный формат даты");
  //HEre...
  let [dateStart, dateEnd] = message.split("-");
  dateStart = moment(dateStart, "DD/MM/YYYY").format("YYYY.MM.DD");
  dateEnd = moment(dateEnd, "DD/MM/YYYY").format("YYYY.MM.DD");
};

module.exports = { workoutByPeriodAction, finishWorkoutByPeriodAction };
