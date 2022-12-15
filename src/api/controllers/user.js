import Path from 'path';
import { BadGatewayError, NotFoundException, UnAuthorizationError, ForbiddenError } from "../helpers/error.js";
import UsersService from '../services/user.js';
import { signToken } from '../helpers/jwt.js'
import { admin } from '../../../config.js'
import { writeProfileImage } from "../helpers/file.js"

export default class UsersController {
  constructor() {
    this.userService = new UsersService();
  }

  async getUsers(req, res, next) {
    try {
      const users = await this.userService.getUsers();
      return res.send(JSON.stringify({
        ok: true,
        message: "OK.",
        data: users || []
      }))
    } catch (error) {
      next(error);
    }
  }
  
  async getUser(req, res, next) {
    try {
      const { id } = req.params
      if (!id) return res.send("id is require!");
  
      const user = await this.userService.getUser({_id: id});
      if (!user) throw new NotFoundException("user not found!");

      return res.send(JSON.stringify({
        ok: true,
        message: "user found.",
        data: user
      }))
    } catch (error) {
      next(error);
    }
  }

  async getProfileImage(req, res, next) {
    try {
      const { userId, fileName } = req.params;
      if (!(userId || fileName)) throw new NotFoundException("userId or fileName is require!");

      if (userId) {
        const found_user = await this.userService.getUser({ _id: userId });
        if (!found_user) throw new NotFoundException("user not found!");
        
        return res.sendFile(Path.join(process.cwd(), 'files', 'profile-images', found_user.profile_img));
      }
      if (fileName) {
        return res.sendFile(Path.join(process.cwd(), 'files', 'profile-images', fileName));
      }

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

      const user = { ...(await this.userService.login(username, password))._doc };
      if (!user) throw new UnAuthorizationError("The invalid password.");
      user["user-agent"] = req.headers["user-agent"];
      
      const token = signToken(user);

      return res.send(JSON.stringify({
        ok: true,
        message: "The user successfully finded.",
        data: user,
        token: {
          access_token: token
        }
      }))
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { body: { username, password }, file } = req;
      if (!(username && password)) return res.send(new UnAuthorizationError("username and password is require!"));
  
      const found_user = await this.userService.getUser({ username });
      if (found_user) throw new UnAuthorizationError("user already signin!");
      let filename;

      if (file) {
        filename = await writeProfileImage(file);
      }

      const user = { ...(await this.userService.createUser({ username, password, profile_img: filename }))._doc };
      user["user-agent"] = req.headers["user-agent"];

      const token = signToken(user);
      return res.send(JSON.stringify({
        ok: true,
        data: user,
        token: {
          access_token: token,
        }
      }))
    } catch (error) {
      next(error);
    }
  }

  async updateUserSocketID (req, res, next) {
    try {
      const { body: { socketID }, user } = req;
      if (!socketID) throw new NotFoundException("socket id not found");

      const updated_user = await this.userService.updateUser(user._id, { socket_id: socketID });
      return res.send(JSON.stringify({
        ok: true,
        message: "socketID successfully updated",
        data: {
          user: updated_user,
        }
      })).status(201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params
      const { username, new_password, old_password } = req.body
      if (!id) throw new NotFoundException("id is require!");

      const user = await this.userService.getUser({ _id: id });
      if (!user) throw UnAuthorizationError("user not defined!");

      if (old_password) {
        if (new_password) throw new NotFoundException("password not defined!");
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

        updated_user = { ...(await this.userService.updateUser(id, { username }))._doc };
      }

      updated_user["user-agent"] = req.headers["user-agent"];
      const token = signToken(updated_user);

      return res.send(JSON.stringify({
        ok: true,
        message: "user successfully updated!",
        data: updated_user,
        token: {
          access_token: token,
        }
      })).status(201);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const user = await this.userService.getUser({ _id: id });
      
      if (!id) throw new BadGatewayError("id is require!");
      if (!user) throw new UnAuthorizationError("user is not defined!");
      
      const deleted_user = await this.userService.deleteUser({ _id: id });
    
      return res.send(JSON.stringify({
        ok: true,
        message: "user successfully deleted!",
        data: deleted_user,
      })).status(201);
    } catch (error) {
      next(error);
    }
  }

  // Write to delete mock data.
  async deleteAllUsers(req, res, next) {
    try {
      const { login, password } = req.body;
      if (!(login && password)) throw new NotFoundException("login and password is require!");
      if (!admin.check(login, password)) throw new ForbiddenError("login or password invalid!");

      const deleted_users = await this.userService.deleteAllUsers();
    
      return res.send(JSON.stringify({
        deleted_users
      }));
    } catch (error) {
      next(error);
    }
  }
}