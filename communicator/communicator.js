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

  exerciseDescriptionReply = async (exercise) => {
    let message = `*${exercise.name}*\n\n`;
    message += "Шаги выполнения:\n";
    exercise.steps.forEach((step) => {
      message += `_${step.step_name}_\n`;
      step.description.forEach((desc) => {
        message += `*${desc.phase}:* ${desc.instruction}\n`;
        // console.log(desc);
        // message += step.description.join();
      });
      message += "\n";
    });

    message += "Целевые мышцы:\n";
    message += `Основные: ${exercise.target_muscles.primary.join(", ")}\n`;
    message += `Вторичные: ${exercise.target_muscles.secondary.join(", ")}\n`;
    message += `Дополнительные: ${exercise.target_muscles.additional.join(
      ", "
    )}\n`;
    return message;
  };

  libraryReplyer = async (imgUrl, message, exerciseDescription) => {
    const reply = await this.exerciseDescriptionReply(exerciseDescription);
    await this.reply((message += " :"));
    await this.replyWithAnimation(imgUrl);
    await this.reply(reply);
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
