import User from '../database/models/user.js';
import { InternalServerError, NotFoundException, UnAuthorizationError } from '../helpers/error.js'

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
      if (!(_id && params)) throw new InternalServerError("_id and params is require!");
      const found_user = await this.userRepository.findOne({ _id });
      if (!found_user) throw new InternalServerError("user not found!");

      // update user params
      await this.userRepository.findOneAndUpdate({ _id }, params);

      const updated_user = await this.userRepository.findOne({ _id });
      updated_user.password = undefined;
      updated_user.socket_id = undefined; // it cannot be added to the token as it is always changing.

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

  async deleteAllUsers() {
    try {
      const all_user = await this.getUsers();

      for(const user of all_user)
        await this.deleteUser({ _id: user._id }); // delete all users
      
      return all_user;
    } catch (error) {
      throw error;
    }
  }
}