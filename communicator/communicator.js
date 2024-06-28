const { Markup } = require("telegraf");
const botHelper = require("../helpers/helpers");

class Communicator {
  #ctx;
  constructor(ctx) {
    this.#ctx = ctx;
  }
  reply = async (message) => {
    await this.#ctx.reply(message);
  };

  replyWithAnimation = async (imgUrl) => {
    await this.#ctx.replyWithAnimation({
      source: (imgUrl += ".gif"),
    });
  };

  replyWithHTML = async (
    titleQuestion = "",
    buttonsArray = [],
    keyForCallback
  ) => {
    await this.#ctx.replyWithHTML(
      titleQuestion,
      Markup.inlineKeyboard(
        buttonsArray.map((buttonLabel) => [
          Markup.button.callback(
            buttonLabel,
            botHelper.callbackCreator(keyForCallback, buttonLabel)
          ),
        ])
      )
    );
  };

  markupReplier = async (titleQuestion, buttonsArray, keyForCallback) => {
    // if (buttonsArray.length > 5) buttonsArray = sliseArray(buttonsArray);
    await botHelper.historyDestroyer(this.#ctx);
    await this.replyWithHTML(titleQuestion, buttonsArray, keyForCallback);
  };
}

module.exports = Communicator;
