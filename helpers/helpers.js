const { Markup } = require("telegraf");

const startOptions = [
  "Создать новый профиль",
  "Что-то еще очень нужное",
  "Не менее нужное",
];

const buttonsLabelsForNewSetCommand = [
  "Добавить новый подход",
  "Удалить созданный подход",
];

const questionTitlesForNewSet = [
  "Выберите мышечную группу :",
  "Выберите подгруппу :",
  "Выберите упражнение :",
  "Выберите количество повторений :",
  "Введите вес снаряда в цифрах :",
];

const registrationQuestions = [
  "Введите имя и фамилию :",
  "Ведите адрес электорнной почты :",
  "Ведите номер телефона в формате 380XXXXXXXX:",
];

const checkUserName = (ctx) => {
  return ctx.message.from.username
    ? ctx.message.from.username
    : `${ctx.message.from.first_name}-${ctx.message.from.id}`;
};

const checkUserNameFromCallbackQuery = (ctx) => {
  return ctx.callbackQuery.from.username
    ? ctx.callbackQuery.from.username
    : `${ctx.callbackQuery.from.first_name}-${ctx.callbackQuery.from.id}`;
};

const callbackCreator = (key, value) => `${key}=${value}`;

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

const markupReplier = async (
  ctx,
  titleQuestion = "",
  buttonsArray = [],
  keyForCallback
) => {
  // if (buttonsArray.length > 5) buttonsArray = sliseArray(buttonsArray);

  await ctx.replyWithHTML(
    titleQuestion,
    Markup.inlineKeyboard(
      buttonsArray.map((buttonLabel) => [
        Markup.button.callback(
          buttonLabel,
          callbackCreator(keyForCallback, buttonLabel)
        ),
      ])
    )
  );
};

const historyDestroyer = async (ctx) => {
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

module.exports = {
  checkUserName,
  markupReplier,
  checkUserNameFromCallbackQuery,
  buttonsLabelsForNewSetCommand,
  questionTitlesForNewSet,
  callbackCreator,
  historyDestroyer,
  startOptions,
  registrationQuestions,
};
