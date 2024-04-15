const botHelper = require("../helpers/helpers");

class User {
  #exercises;

  constructor(userName, questionTitles) {
    this.userName = userName;
    this.currentLabel = 0;
    this.questionTitles = questionTitles;
    this.label = this.questionTitles[this.currentLabel];
    this.answers = botHelper.getAnswersForNewSet();
    this.path = "";
    this.#exercises = [];
  }

  updateCurrentLabel = () => {
    this.currentLabel += 1;
    this.label = this.questionTitles[this.currentLabel];
  };

  resetCurrentLabel = () => {
    this.currentLabel = 0;
    this.label = this.questionTitles[this.currentLabel];
  };

  updateUnswers = (callbackQuery) => {
    const [key, value] = callbackQuery.split("=");
    if (key === "exersice")
      return (this.answers.exersice = `${this.answers.currentGroup} - ${this.answers.subGroup} - ${value}`);
    if (key == "typeOfAction") return;
    this.answers = { ...this.answers, [key]: value };
  };

  resetUnswers = () => {
    this.answers = Object.entries(this.answers).reduce(
      (acc, field) => ({ ...acc, [field[0]]: null }),
      {}
    );
  };

  setUnswers = (answers) => {
    this.answers = answers;
  };

  setQuestions = (questionTitles) => {
    this.questionTitles = questionTitles;
  };

  updatePath = (partOfPath) => {
    this.path += `${partOfPath}/`;
  };

  resetPath = () => {
    this.path = "";
  };

  setExercisesForForcedUpdateInDB = (exercisesArray) => {
    if (!Array.isArray(exercisesArray))
      return console.log("exercisesArray must be an array");
    this.#exercises = this.#exercises.concat(exercisesArray);
  };

  getCurrentExercises = () => {
    return this.#exercises;
  };

  resetCurrentExercises = () => {
    this.#exercises = [];
  };

  exercisesForcedUpdate = (numOfExercise, numOfSet) => {
    if (typeof numOfExercise != "number" || typeof numOfSet != "number")
      return console.log("numOfExercise, numOfSet must be a number");

    const currentExercises = this.getCurrentExercises();
    const exersise = [...currentExercises[numOfExercise - 1][1]];
    const set = exersise.find((ex) => ex.numberOfSet == numOfSet);
    this.resetCurrentExercises();
    return set && set._id.toString();
  };
}

module.exports = { User };
