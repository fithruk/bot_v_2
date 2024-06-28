const axios = require("axios");

class ApiService {
  async initialNewTraining(userName) {
    const { data } = await axios.post(`${process.env.API_ADRESS}/trainings`, {
      userName,
    });
    return data;
  }

  async getAllMusclesGroupes() {
    const { data } = await axios.get(`${process.env.API_ADRESS}/exercise`);
    return data;
  }

  async getExercisesSubGroupe(groupe) {
    const { data } = await axios.post(
      `${process.env.API_ADRESS}/exercise/subGroupe`,
      {
        groupe,
      }
    );

    return data;
  }

  async getExercisesByGroupe(groupe) {
    const { data } = await axios.post(`${process.env.API_ADRESS}/exercise`, {
      groupe,
    });

    return data;
  }

  async getApartExerciseBySubGroup(currentGroup, subDirectory) {
    const { data } = await axios.post(
      `${process.env.API_ADRESS}/exercise/bySubDirectory`,
      {
        currentGroup,
        subDirectory,
      }
    );

    return data;
  }

  async getCurrentTraining(userName) {
    const { data } = await axios.post(
      `${process.env.API_ADRESS}/trainings/getCurrentTrainingSession`,
      {
        userName,
      }
    );
    return data;
  }

  async closeCurrentTraining(userName) {
    const { data, status } = await axios.post(
      `${process.env.API_ADRESS}/trainings/closeTrainingSession`,
      {
        userName,
      }
    );
    return { data, status };
  }

  async updateTrainingPerfomance(userName, exercise, countOfReps, weight) {
    const { data } = await axios.put(
      `${process.env.API_ADRESS}/trainings/updateTrainingPerfomance`,
      {
        userName,
        exercise,
        countOfReps,
        weight,
      }
    );
    return data;
  }

  async isTrainingExist(userName) {
    const { data } = await axios.post(
      `${process.env.API_ADRESS}/trainings/isTrainingExist`,
      {
        userName,
      }
    );
    return data;
  }

  async removeSet(userName, id) {
    const { data } = await axios.patch(
      `${process.env.API_ADRESS}/trainings/removeSet`,
      {
        userName,
        id,
      }
    );

    return data;
  }

  async findUser(userName) {
    const { data } = await axios.post(
      `${process.env.API_ADRESS}/registration/getUser`,
      {
        userName,
      }
    );
    return data;
  }

  async createUser(userName, answers) {
    const { name, email, phone } = answers;
    const [firstName, lastName] = name.split(" ");
    const { data } = await axios.post(
      `${process.env.API_ADRESS}/registration/createNewUser`,
      {
        userName,
        firstName,
        lastName,
        email,
        phone,
      }
    );
    return data;
  }

  async getAbsRecords(userName) {
    const { data, status } = await axios.get(
      `${process.env.API_ADRESS}/analitics/absRecords`,
      {
        params: {
          userName,
        },
      }
    );

    return { data, status };
  }

  async getWorkoutByPeriod(userName, dateStart, dateEnd) {
    const { data, status } = await axios.post(
      `${process.env.API_ADRESS}/analitics/workoutByPeriod`,
      {
        userName,
        dateStart,
        dateEnd,
      }
    );

    return { data, status };
  }

  async getStatByExersice(userName, exersiceSring) {
    const { data, status } = await axios.post(
      `${process.env.API_ADRESS}/analitics/statByExersice`,
      {
        userName,
        exersiceSring,
      }
    );

    return { data, status };
  }

  async loadExImage(groupe, subGroupe, exName) {
    const { data, status } = await axios.post(
      `${process.env.API_ADRESS}/exercise/loadExersiceImage`,
      {
        groupe,
        subGroupe,
        exName,
      }
    );

    return { data, status };
  }
}

const apiService = new ApiService();
module.exports = { apiService };
