const moment = require("moment");

class HtmlResponce {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async removeSetResponce(exerciseArray) {
    if (!Array.isArray(exerciseArray))
      return console.log("exerciseArray mast be an array, removeResponce");

    const exerciseArrayString = exerciseArray
      .map((ex, ind) => {
        return `\nУпражнение №${ind + 1}: <b>${ex[0]}</b>\nПодходы:
         ${ex[1].map(
           ({ numberOfSet, countOfReps, weight }) =>
             `
        Номер подхода : ${numberOfSet}
        Количество повторений : ${countOfReps}
        Вес снаряда : ${weight}
        `
         )}`;
      })
      .join("\n");

    const fullResponce = `
Было выполнено:
    ${exerciseArrayString}
Введите данные о подходе который нужно удалить,в формате : Номер упражнения: [Число]-Номер подхода :[число]\n
    
<b>Пример 2-3</b>`;
    this.ctx.replyWithHTML(fullResponce);
  }

  async absRecordsResponce(dataArrFromDB) {
    if (!Array.isArray(dataArrFromDB))
      return console.log("dataArrFromDB mast be an array, removeResponce");

    const htmlMessage = dataArrFromDB
      .map(({ _id, maxWeight, date }) => {
        return `<b>Упражнение: \n${
          _id.exerciseName
        }</b>:\nПоднятый вес - ${maxWeight}, \nДата - ${moment(date).format(
          "MMM Do YYYY"
        )}`;
      })
      .join("\n\n");

    this.ctx.replyWithHTML(`<b>Рекорды :</b>\n${htmlMessage}`);
  }
}

module.exports = HtmlResponce;
