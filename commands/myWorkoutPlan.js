const { apiService } = require("../apiService/apiService");
const Communicator = require("../communicator/communicator");
const botHelper = require("../helpers/helpers");

const myWorkoutPlan = async (ctx) => {
  const userName = botHelper.checkUserName(ctx);
  const communicator = new Communicator(ctx);
  const { isExist } = await apiService.findUser(userName);
  if (!isExist)
    return communicator.reply(
      "Необходима регистрация, выполните команду '/start'"
    );
  let { data: myPlan } = await apiService.loadPersonalWorkoutPlan(userName);
  const { currentUserSession } = await apiService.getCurrentTraining(userName);

  const exerciseArray = [...currentUserSession.exercises];

  const uniqueExercises = exerciseArray.reduce(
    (acc, next) => ({ ...acc, [next.exercise]: [] }),
    {}
  );

  exerciseArray.forEach((exercise) => {
    if (uniqueExercises[exercise.exercise]) {
      const exPlan = myPlan.find(
        (exPlan) => exPlan.exersice == exercise.exercise
      );
      if (exercise.weight >= exPlan.weight)
        uniqueExercises[exercise.exercise].push(exercise);
    }
  });

  myPlan = myPlan.map((exPlan) => {
    if (uniqueExercises[exPlan.exersice]) {
      const setsLeft = `${
        exPlan.sets - uniqueExercises[exPlan.exersice].length <= 0
          ? "Упражнение выполнено полностью"
          : `Осталось подходов: ${
              exPlan.sets - uniqueExercises[exPlan.exersice].length
            }`
      }`;
      return {
        exersice: exPlan.exersice,
        setsLeft,
        expectWeight: exPlan.weight,
        expectedReps: exPlan.reps,
      };
    } else {
      return {
        exersice: exPlan.exersice,
        setsLeft: `Осталось подходов: ${exPlan.sets}`,
        expectWeight: exPlan.weight,
        expectedReps: exPlan.reps,
      };
    }
  });
  new Communicator(ctx).personalWorkoutPlanReply(myPlan);
};

module.exports = { myWorkoutPlan };
