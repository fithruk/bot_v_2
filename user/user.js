class User {
  constructor(userName, questionTitlesForNewSet) {
    this.userName = userName;
    this.currentLabel = 0;
    this.questionTitlesForNewSet = questionTitlesForNewSet;
    this.label = this.questionTitlesForNewSet[this.currentLabel];
    this.answers = {
      currentGroup: "",
      exersice: "",
      countOfReps: 0,
      weightOfequipment: 0,
    };
    this.path = "";
    // this.exercises = [];
  }

  updateCurrentLabel = () => {
    this.currentLabel += 1;
    this.label = this.questionTitlesForNewSet[this.currentLabel];
  };

  resetCurrentLabel = () => {
    this.currentLabel = 0;
    this.label = this.questionTitlesForNewSet[this.currentLabel];
  };

  updateUnswers = (callbackQuery) => {
    const [key, value] = callbackQuery.split("=");
    this.answers = { ...this.answers, [key]: value };
  };

  resetUnswers = () => {
    this.answers = {
      currentGroup: "",
      exersice: "",
      countOfReps: 0,
      weightOfequipment: 0,
    };
  };

  updatePath = (partOfPath) => {
    this.path += `${partOfPath}/`;
  };

  resetPath = () => {
    this.path = "";
  };
}

module.exports = { User };
