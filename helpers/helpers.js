const { Markup } = require("telegraf");
const userState = require("../userState/userState");

class BotHelper {
  #startOptions = ["Создать новый профиль"];

  #buttonsLabelsForNewSetCommand = [
    "Выбрать упражнение",
    "Удалить созданный подход",
    "Добавить новый подход",
  ];

  #questionTitlesForNewSet = [
    "Выберите мышечную группу :",
    "Выберите подгруппу :",
    "Выберите упражнение :",
    "Выберите количество повторений :",
    "Введите общий вес снаряда в цифрах :",
  ];

  #registrationQuestions = [
    "Введите имя и фамилию :",
    "Введите адрес электорнной почты :",
    "Введите номер телефона в формате 380XXXXXXXX:",
  ];

  #libraryOtions = ["Библиотека управжений"];

  #answersForNewSet = {
    currentGroup: null,
    subGroup: null,
    exersice: null,
    countOfReps: null,
    weightOfequipment: null,
  };

  #statOptions = [
    "Личные рекорды 📊",
    "Прогресс по упражнению 📈",
    "Объем нагрузки 🧑‍🦽",
    " ",
  ];

  #workoutOptions = [
    "Начать новую тренировку '🏋'",
    "Текущая тренировка '💪'",
    "Тренировки за период 📅",
    "Закончить тренировку '🪫'",
    "Свободная тренировка 👤",
    "Тренировка от тренера 👥",
  ];

  getstartOptions = () => {
    return this.#startOptions;
  };

  getLibraryOptions = () => {
    return this.#libraryOtions;
  };

  getButtonsLabelsForNewSetCommand = () => {
    return this.#buttonsLabelsForNewSetCommand;
  };

  getQuestionTitlesForNewSet = () => {
    return this.#questionTitlesForNewSet;
  };

  getRegistrationQuestions = () => {
    return this.#registrationQuestions;
  };

  getAnswersForNewSet = () => {
    return this.#answersForNewSet;
  };

  getStatOptions = () => {
    return this.#statOptions;
  };

  getWorkoutOptions = () => {
    return this.#workoutOptions;
  };

  checkUserName = (ctx) => {
    return ctx.message.from.username
      ? ctx.message.from.username
      : `${ctx.message.from.first_name}-${ctx.message.from.id}`;
  };

  checkUserNameFromCallbackQuery = (ctx) => {
    return ctx.callbackQuery.from.username
      ? ctx.callbackQuery.from.username
      : `${ctx.callbackQuery.from.first_name}-${ctx.callbackQuery.from.id}`;
  };

  callbackCreator = (key, value) => `${key}=${value}`;

  // const sliseArray = (array) => {
  //   if (!Array.isArray(array)) return;

  //   const resArr = [];
  //   const newArr = [...array];

  //   let start = 0,
  //     step = 4;

  //   if (newArr.length > 4) {
  //     for (let i = 0; i < newArr.length; i++) {
  //       let buttonsRow = newArr.slice(start, step + start);
  //       resArr.push([...buttonsRow]);
  //       start += step;
  //       if (start > newArr.length) break;
  //     }
  //   }
  //   return resArr;
  // };

  // markupReplier = async (
  //   ctx,
  //   titleQuestion = "",
  //   buttonsArray = [],
  //   keyForCallback
  // ) => {
  //   // if (buttonsArray.length > 5) buttonsArray = sliseArray(buttonsArray);
  //   await this.historyDestroyer(ctx);
  //   await ctx.replyWithHTML(
  //     titleQuestion,
  //     Markup.inlineKeyboard(
  //       buttonsArray.map((buttonLabel) => [
  //         Markup.button.callback(
  //           buttonLabel,
  //           this.callbackCreator(keyForCallback, buttonLabel)
  //         ),
  //       ])
  //     )
  //   );
  // };

  historyDestroyer = async (ctx) => {
    const messageId = ctx.callbackQuery
      ? ctx.callbackQuery.message.message_id
      : ctx.message.message_id;
    let i = 0;

    while (true) {
      try {
        await ctx.deleteMessage(messageId - i++);
      } catch (e) {
        break;
      }
    }
  };

  resetUserPath = (userName) => {
    const currentUser = userState.findUser(userName);
    currentUser.resetPath();
  };
}

module.exports = new BotHelper();
