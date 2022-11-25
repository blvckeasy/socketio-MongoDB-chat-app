import User from '../database/models/user.js';

export default class UsersService {
  constructor() {
    this.userRepository = User;
  }

  async getUsers(filter) {
    try {
      const users = await this.userRepository.find(filter);
      users.map((user) => user.password = undefined)
      return users
    } catch (error) {
      throw error;
    }
  }

  async getUser(params) {
    try {
      const user = await this.userRepository.findOne(params);
      if (user) {
        user.password = undefined
        return user
      }
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    try {
      const user = await this.userRepository.findOne({ username }).clone();
      const check_password = await user.checkPassword(password);

      if (check_password) {
        user.password = undefined;
        return user;
      }
    } catch (error) {
      throw error;
    }
  }

  async createUser(params) {
    try {
      const user = await this.userRepository.create(params);
      user.password = undefined
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(_id, params) {
    try {
      // update user params
      await this.userRepository.findOneAndUpdate({ _id }, params);
      
      const updated_user = await this.userRepository.findOne({ _id });
      updated_user.password = undefined;
      return updated_user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(params) {
    try {
      const deleted_user = await this.userRepository.findOneAndDelete(params);
      deleted_user.password = undefined 
      return deleted_user;
    } catch (error) {
      throw error;
    }
  }
}