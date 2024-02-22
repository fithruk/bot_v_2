class HtmlRecponce {
  constructor(context) {
    this.ctx = context;
  }

  async removeSetResponce(exerciseArray) {
    if (!Array.isArray(exerciseArray))
      return console.log("exerciseArray mast be an array, removeSetResponce");
    const exerciseArrayString = exerciseArray
      .map(
        (ex) =>
          `\nУпражнение :<b>${ex.exercise}</b>\nБыло выполнено подходов : ${ex.numberOfSet}\n`
      )
      .join("\n");
    const fullResponce = `
Было выполнено:
    ${exerciseArrayString}
Введите данные о подходе который нужно удалить,в формате : Упражнение :[название упражнения]\nПодход :[номер подхода числом]\n
    `;
    this.ctx.replyWithHTML(fullResponce);
  }
}

module.exports = HtmlRecponce;
