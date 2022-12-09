import {
  ForbiddenError,
  NotFoundException,
  UnAuthorizationError,
} from '../helpers/error.js'
import UsersService from '../services/user.js'
import MessageService from '../services/message.js'
import { admin } from '../../../config.js'

export default class MessageController {
  constructor(MessageRepository, UserRepository) {
    this.Message = MessageRepository
    this.User = UserRepository
    this.messageService = new MessageService();
    this.usersService = new UsersService(); 
  }

  async deleteUndefinedFromObject(filter) {
    await Object.keys(filter).forEach(key => filter[key] === undefined ? delete filter[key] : {});
    return filter;
  }

  async getMessages(req, res, next) {
    try {
      const { to_user_id, from_user_id, id } = req.query
      const found_sms_sended_user = await this.usersService.getUser({ _id: to_user_id });
      const found_sms_recipient_user = await this.usersService.getUser({ _id: from_user_id });

      if (found_sms_sended_user && found_sms_recipient_user) throw new NotFoundException("users not found!");

      const filter = await this.deleteUndefinedFromObject({ to_user_id, from_user_id, id });
      const messages = await this.messageService.getMessages(filter);

      return res.send(JSON.stringify({
        ok: true,
        data: {
          messages: messages || [],
        }
      })).status(201);
    } catch (error) {
      next(error);
    }
  }

  async postMessage(req, res, next) {
    try {
      const { body: { to_user_id, message }, user } = req;

      if (!user) throw new UnAuthorizationError("user is require!");
      if (!(user._id && to_user_id && message)) throw new NotFoundException("Insufficient data found in req body");
  
      const select_users = await this.usersService.getUsers({
        $or: [{ _id: user._id }, { _id: to_user_id }],
      }) || []

      // it is necessary to check that from_user_id and to_user_id are in the database
      if (select_users.length < 2) throw new UnAuthorizationError('from_user_id or to_user_id was not found in the database')
  
      const newMessage = await this.messageService.postMessage({
        from_user_id: user._id,
        to_user_id,
        message,
      });
  
      return res.send(JSON.stringify({
        status: 201,
        message: 'Message successfully created.',
        data: newMessage,
      })).status(201)
    } catch (error) {
      next(error);
    }
  }

  async editMessage(req, res, next) {
    try {
      const { body: { message }, params: { id }, user } = req;

      const found_message = (await this.messageService.getUserMessages({ _id: id }))[0];
      if (!found_message) throw new NotFoundException("message is not found in database!");
      if (found_message.to_user_id != user._id && found_message.from_user_id != user._id || found_message.to_user_id == user._id) throw new ForbiddenError("You have not been granted access to this information!");

      const updated_message = await this.messageService.patchMessage({ _id: id }, { message });
      if (!updated_message) throw new NotFoundException("message not found!");

      return res.send(JSON.stringify({
        ok: true,
        message: 'message successfully edited.',
        data: updated_message,
      })).status(200)
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const { params: { id }, user } = req;     
      if (!id) throw new NotFoundException("id is require!");

      const found_message = (await this.messageService.getMessages({ _id: id }))[0];
      if (!found_message) throw new NotFoundException("message is not found in database!");
      if (found_message.to_user_id != user._id && found_message.from_user_id != user._id) throw new ForbiddenError("You have not been granted access to this information!");

      const deleted_message = await this.messageService.deleteMessage({ _id: id });
      if (!deleted_message) throw new NotFoundException("message is not defined!");

      return res.send(JSON.stringify({
        ok: true,
        message: 'message successfully deleted.',
        data: deleted_message,
      })).status(200)
    } catch (error) {
      next(error);
    }
  }

  async deleteChat(req, res, next) {
    try {
      const { params: { user_id }, user } = req;
      if (!user_id) throw new NotFoundException("id is require!");
      if (!user) throw new UnAuthorizationError("user is not found!");

      const found_messages = await this.messageService.getMessages({
        $or: [
          { from_user_id: user._id, to_user_id: user_id },
          { from_user_id: user_id, to_user_id: user._id },
        ]
      });
      if (!found_messages) throw new NotFoundException("chat not found!");

      const delete_messages = await this.messageService.deleteChat({
        $or: [
          { from_user_id: user._id, to_user_id: user_id },
          { from_user_id: user_id, to_user_id: user._id },
        ]        
      });

      return res.send(JSON.stringify({
        ok: true,
        message: "chat successfully deleted",
        data: delete_messages,
      })).status(200);
    } catch (error) {
      next(error);
    }
  }

  async deleteAllMessages(req, res, next) {
    try {
      const { login, password } = req.body;
      if (!(login && password)) throw new NotFoundException("login and password is require!");
      if (!admin.check(login, password)) throw new ForbiddenError("login or password invalid!");

      const deleted_messages = await this.messageService.deleteAllMessages();
      return res.send({
        deleted_messages
      });
    } catch (error) {
      next(error);
    }
  }
}
