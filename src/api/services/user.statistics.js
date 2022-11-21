import UserStatistics from "../database/models/user.statistics.js";

export default class UsersStatisticsService {
  constructor () {
    this.userStatisticsRepository = UserStatistics;
  }

  async getUserStatistics(params) {
    try {
      const statistics = await this.userStatisticsRepository.find(params);
      return statistics;
    } catch (error) {
      throw error;
    }
  }

  async getUserLastStatistic(params) {
    try {
      const statistics = await this.userStatisticsRepository.find(params);
      return statistics[statistics.length - 1];
    } catch (error) {
      
    }
  }

  async postUserStatistics(params) {
    try {
      const new_statistic = await this.userStatisticsRepository.create(params);
      return new_statistic;
    } catch (error) {
      throw error;
    }
  }

  async patchUserStatistics(filter, update) {
    try {
      const updated_statistics = await this.userStatisticsRepository.findOneAndUpdate(filter, update);
      return updated_statistics;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserStatistics(filter, options) {
    try {
      const deleted_statistics = await this.userStatisticsRepository.findOneAndDelete(filter, options)
      return deleted_statistics;
    } catch (error) {
      throw error;
    }
  }
}