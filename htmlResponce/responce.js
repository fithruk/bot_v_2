class HtmlRecponce {
  constructor(context) {
    this.ctx = context;
  }

  async removeSetResponce(exerciseArray) {
    if (!Array.isArray(exerciseArray))
      return console.log("exerciseArray mast be an array, removeSetResponce");
    const exerciseArrayString = exerciseArray
      .map(
        (ex, ind) =>
          `\nУпражнение №${ind + 1}:<b>${
            ex.exercise
          }</b>\nБыло выполнено подходов : ${ex.numberOfSet}\n`
      )
      .join("\n");
    const fullResponce = `
Было выполнено:
    ${exerciseArrayString}
Введите данные о подходе который нужно удалить,в формате : Номер упражнения: [Число]-Номер подхода :[число]\n
    
<b>Пример 2-3</b>`;
    this.ctx.replyWithHTML(fullResponce);
  }
}

module.exports = HtmlRecponce;
