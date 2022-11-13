import { MongooseInvalidDataError, UnAuthorizationError } from "../helpers/error.js";
import User from '../database/models/user.js';


export default class UsersService {
  constructor(UserRepository = User) {
    this.UserRepository = UserRepository;
  }

  async getUsers() {
    try {
      const users = await this.UserRepository.find().clone();
      users.map((user) => user.password = undefined)
      return users
    } catch (error) {
      throw error;
    }
  }

  async getUser(params) {
    try {
      const user = await this.UserRepository.findOne(params);
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
      const user = await this.UserRepository.findOne({ username }).clone();
      const check_password = await user.checkPassword(password);

      if (check_password) {
        user.password = undefined;
        return user;
      }
    } catch (error) {
      throw error;
    }
  }

  async createUser(username, password) {
    try {
      const user = await this.UserRepository.create({ username, password });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(_id, params) {
    try {
      // update user params
      await this.UserRepository.findOneAndUpdate({ _id }, params);
      
      const updated_user = await this.UserRepository.findOne({ _id });
      return updated_user;
    } catch (error) {
      throw error;
    }
  }
}