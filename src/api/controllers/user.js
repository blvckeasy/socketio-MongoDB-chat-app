import { BadGatewayError, MongooseInvalidDataError, NotDefinedError, UnAuthorizationError, AlreadySignInError } from "../helpers/error.js";
import User from '../database/models/user.js';
import UsersService from '../services/user.js';

export default class UsersController {
  constructor(UserRepository = User) {
    this.UserRepository = UserRepository;
    this.userService = new UsersService(User);
  }

  async getUsers(req, res, next) {
    try {
      const users = await this.userService.getUsers();
      return res.send({
        status: 200,
        ok: true,
        message: "OK.",
        data: users || []
      })
    } catch (error) {
      next(error);
    }
  }
  
  async getUser(req, res, next) {
    try {
      const { id } = req.params
      if (!id) return res.send("id is require!");
  
      const user = await this.userService.getUser({_id: id});
  
      if (user) {
        return res.send({
          status: 200,
          ok: true,
          message: "user found.",
          data: user
        })
      }
      
      return res.send({
        status: 404,
        ok: false,
        message: "user not found.",
        data: {},
      })
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!(username && password)) throw new UnAuthorizationError("username and password is require!");

      const found_user = await this.userService.getUser({ username });
      if (!found_user) throw new UnAuthorizationError("user not registered!");

      const user = await this.userService.login(username, password)
      if (!user) throw new UnAuthorizationError("The invalid password.");

      return res.send({
        status: 200,
        ok: true,
        message: "The user successfully finded.",
        data: user
      })
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!(username && password)) return res.send(new UnAuthorizationError("username and password is require!"));
  
      const found_user = await this.userService.getUser({ username });
      if (found_user) throw new UnAuthorizationError("user already signin!");

      const user = await this.userService.createUser(username, password);
      return res.send({
        status: 200,
        ok: true,
        data: user,
      })
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params
      const { username, new_password, old_password } = req.body
      if (!id) throw new NotDefinedError("id is require!");

      const user = await this.userService.getUser({ _id: id });
      if (!user) throw UnAuthorizationError("user not defined!");

      if (old_password) {
        if (new_password) throw new NotDefinedError("password not defined!");
        if (new_password === old_password) throw new BadGatewayError("password and old_password is equal!");

        // The checkPassword function returns a boolean value comparing the password to the user's password
        const check_password = user.checkPassword(new_password);
        if (check_password) {
          var updated_user = await this.userService.updateUser(id, { password: new_password });
        } 
      }

      if (username) {
        const find_user_from_username = await this.userService.getUser({ username });
        if (find_user_from_username) throw new UnAuthorizationError(`"${username}" username already taken!`);

        updated_user = await this.userService.updateUser(id, { username });
      }

      return res.send({
        ok: true,
        message: "user successfully updated!",
        data: updated_user,
      }).status(201);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const user = await this.UserRepository.findOne({ _id: id }).clone()
      
      if (!id) return res.send({
        status: 400,
        ok: false,
        message: "id is require!"
      })
    
      if (!user) return res.send({
        status: 403,
        ok: false,
        error: { message: "user not found!" }
      })
      
      const deleted_user = await this.UserRepository.findOneAndDelete({ _id: id });
      deleted_user.password = undefined
    
      return res.send({
        status: 201,
        ok: true,
        message: "user successfully deleted!",
        data: deleted_user,
      })
    } catch (error) {
      next(error);
    }
  }

  async deleteAll() {
    const deleted_users = await this.UserRepository.deleteMany();
    return res.send(deleted_users);
  }
}