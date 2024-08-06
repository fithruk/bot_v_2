const moment = require("moment");
const Communicator = require("../communicator/communicator");

class HtmlResponce {
  #ctx;
  constructor(ctx) {
    this.#ctx = ctx;
    this.maxLength = 4000;
    this.messages = 0;
    this.communicator = new Communicator(this.#ctx);
  }

  async removeSetResponce(exerciseArray, isDelete = true) {
    if (!Array.isArray(exerciseArray)) {
      return console.log("exerciseArray must be an array, removeResponce");
    }

    const exerciseArrayString = exerciseArray
      .map((ex, ind) => {
        const setsString = ex[1]
          .map(
            ({ numberOfSet, countOfReps, weight }) => `
          <i>Номер подхода:</i> ${numberOfSet}
          <i>Количество повторений:</i> ${countOfReps}
          <i>Вес снаряда:</i> ${weight}`
          )
          .join("\n");

        return `
<b>Упражнение №${ind + 1}:</b> ${ex[0]}
        Подходы:
        ${setsString}`;
      })
      .join("\n");

    const deletePrompt = `
      \nВведите данные о подходе, который нужно удалить, в формате:
      Номер упражнения: [Число] - Номер подхода: [Число]
      <b>Пример: 2-3</b>`;

    let fullResponse = `
      Было выполнено:
      ${exerciseArrayString}`;

    if (isDelete) {
      fullResponse += deletePrompt;
    }

    this.communicator.replyWithHTML(fullResponse);
  }

  async absRecordsResponce(dataArrFromDB) {
    if (!Array.isArray(dataArrFromDB)) {
      return console.log("dataArrFromDB must be an array, absRecordsResponce");
    }

    const htmlMessage = dataArrFromDB
      .map(({ _id, maxWeight, date }) => {
        return `<b>Упражнение:</b> ${_id.exerciseName}
        
        <i>Поднятый вес:</i> ${maxWeight} кг
        <i>Дата:</i> ${moment(date).format("DD MMMM YYYY")}`;
      })
      .join("\n\n");

    this.communicator.replyWithHTML(`
      <b>Рекорды:</b>
      ${htmlMessage}`);
  }

  async workoutByPeriodResponce(workoutByPeriodArr) {
    if (!Array.isArray(workoutByPeriodArr)) {
      return console.log("workoutByPeriodArr must be an array");
    }

    if (workoutByPeriodArr.length === 0) {
      await this.communicator.reply("Отсутствуют данные для вывода.");
      return;
    }

    const htmlMessage = workoutByPeriodArr
      .map(({ dateOfStart, exercises }) => {
        return `
  <b>Дата:</b> ${moment(dateOfStart).format("DD MMMM YYYY")}
  ${exercises
    .map(
      ({ exercise, numberOfSet, countOfReps, weight }) => `
• Упражнение: ${exercise}
    Номер подхода: ${numberOfSet}
    Количество повторений: ${countOfReps}
    Вес снаряда :   ${weight} кг
  `
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

  async reportOfFinishedWorkout(workoutStatData) {
    const {
      averageTimeOfRest,
      workoutDuration,
      tonnage,
      exercisesOfWorkout,
      setsOfWorkout,
    } = workoutStatData;
    let reportMessage = `Продолжительность тренировки составила: ${workoutDuration.durationInHours} : ${workoutDuration.durationInMinutes}\nСреднее время отдыха между подходами: ${averageTimeOfRest.averageRestInMinutes} минут ${averageTimeOfRest.averageRestInSeconds}секунд\nВсего было выполнено ${setsOfWorkout} подходов в ${exercisesOfWorkout} упражнениях\nОбъем тренировки составил ${tonnage} кг.`;
    await this.communicator.reply(reportMessage);
  }
}

module.exports = HtmlResponce;
