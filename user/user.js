class User {
  #exercises;

  constructor(userName, questionTitlesForNewSet) {
    this.userName = userName;
    this.currentLabel = 0;
    this.questionTitlesForNewSet = questionTitlesForNewSet;
    this.label = this.questionTitlesForNewSet[this.currentLabel];
    this.answers = {
      currentGroup: null,
      subGroup: null,
      exersice: null,
      countOfReps: null,
      weightOfequipment: null,
    };
    this.path = "";
    this.#exercises = [];
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
    if (key === "exersice")
      return (this.answers.exersice = `${this.answers.currentGroup} - ${this.answers.subGroup} - ${value}`);
    this.answers = { ...this.answers, [key]: value };
  };

  resetUnswers = () => {
    this.answers = {
      currentGroup: null,
      subGroup: null,
      exersice: null,
      countOfReps: null,
      weightOfequipment: null,
    };
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

  exercisesForcedUpdate = (numOfExercise, numOfSet) => {
    if (typeof numOfExercise != "number" || typeof numOfSet != "number")
      return console.log("numOfExercise, numOfSet must be a number");

    const currentExercises = this.getCurrentExercises();
    const exersise = [...currentExercises[numOfExercise - 1][1]];
    const set = exersise.find((ex) => ex.numberOfSet == numOfSet);

    return set && set._id.toString();
  };
}

module.exports = { User };
