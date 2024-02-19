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

  async getExercisesByGroupe(groupe) {
    const { data } = await axios.post(`${process.env.API_ADRESS}/exercise`, {
      groupe,
    });

    return data;
  }

  async getApartExerciseFull(exercise, subDirectory) {
    const { data } = await axios.post(
      `${process.env.API_ADRESS}/exercise/apart`,
      {
        exercise,
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
}

const apiService = new ApiService();
module.exports = { apiService };
