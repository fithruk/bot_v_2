const moment = require("moment");
const Communicator = require("../communicator/communicator");

class HtmlResponce {
  constructor(ctx) {
    this.ctx = ctx;
    this.maxLength = 4000;
    this.messages = 0;
    this.communicator = new Communicator(this.ctx);
  }

  async removeSetResponce(exerciseArray, isDelete = true) {
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

    const deletePromt =
      "\n\nВведите данные о подходе который нужно удалить,в формате :\n Номер упражнения: [Число]-Номер подхода :[число]\n<b>Пример 2-3</b>";

    let fullResponce = `
Было выполнено:
    ${exerciseArrayString}`;
    if (isDelete) {
      fullResponce += deletePromt;
    }
    this.communicator.replyWithHTML(fullResponce);
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

    this.communicator.replyWithHTML(`<b>Рекорды :</b>\n${htmlMessage}`);
  }

  async workoutByPeriodResponce(workoutByPeriodArr) {
    if (!Array.isArray(workoutByPeriodArr)) {
      return console.log("workoutByPeriodArr must be an array");
    }

    if (workoutByPeriodArr.length === 0) {
      await this.communicator.reply("Отсутствуют данные для вывода.");
    }

    const htmlMessage = workoutByPeriodArr
      .map(({ dateOfStart, exercises }) => {
        return `Дата: ${moment(dateOfStart).format("MMM Do YYYY")}\n
${exercises
  .map(
    ({
      exercise,
      numberOfSet,
      countOfReps,
      weight,
    }) => `• Упражнение:\n${exercise}:
                Номер подхода: ${numberOfSet}
                Количество повторений: ${countOfReps}
                Вес снаряда: ${weight} \n`
  )
  .join("\n")}
        `;
      })
      .join("\n\n");

    const maxLength = this.maxLength;

    if (htmlMessage.length > maxLength) {
      let replyCounter = 1;
      let startPos = 0;

      this.messages = Math.ceil(htmlMessage.length / maxLength);

      while (replyCounter <= this.messages) {
        const messagePart = htmlMessage.substring(
          startPos,
          startPos + maxLength
        );

        if (messagePart.trim().length > 0) {
          await this.communicator.replyWithHTML(messagePart);
        }

        startPos += maxLength;
        replyCounter += 1;
      }
    } else {
      await this.communicator.replyWithHTML(htmlMessage);
    }
  }

  async currentWorlout(currentWorloutExersices) {
    if (!Array.isArray(currentWorloutExersices))
      return console.log(
        "currentWorloutExersices mast be an array, removeResponce"
      );
    await this.removeSetResponce(currentWorloutExersices, false);
  }
}

module.exports = HtmlResponce;
