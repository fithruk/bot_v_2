const { Markup } = require("telegraf");

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
  console.log("buttonsArray");
  console.log(buttonsArray); // --
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

const historyDestroyer = async (ctx, message_id) => {
  let i = 0;

  // const messageId = message_id;
  // console.log(message_id + " message_id");
  while (true) {
    try {
      await ctx.deleteMessage(message_id - i++);
    } catch (e) {
      console.log("break");
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
};
