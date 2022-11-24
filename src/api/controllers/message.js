import {
  MongooseInvalidDataError,
  NotFoundException,
  UnAuthorizationError,
} from '../helpers/error.js'
import UsersService from '../services/user.js'
import MessageService from '../services/message.js'

export default class MessageController {
  constructor(MessageRepository, UserRepository) {
    this.Message = MessageRepository
    this.User = UserRepository
    this.messageService = new MessageService();
    this.usersService = new UsersService(); 
  }

  async deleteUndefinedFromObject(filter) {
    Object.keys(filter).forEach(key => filter[key] === undefined ? delete filter[key] : {});
    return filter;
  }

  async getMessages(req, res, next) {
    try {
      const { to_user_id, from_user_id, id } = req.query
      const found_sms_sended_user = await this.usersService.getUser({ _id: to_user_id });
      const found_sms_recipient_user = await this.usersService.getUser({ _id: from_user_id });

      if (found_sms_sended_user && found_sms_recipient_user) throw new NotFoundException("users not found!");

      const filter = this.deleteUndefinedFromObject({ to_user_id, from_user_id, id });
      const messages = await this.message

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
      const { from_user_id, to_user_id, message } = req.body
      if (!(from_user_id && to_user_id && message)) throw new NotFoundException("Insufficient data found in req body");
  
      const select_users = (await this.User.findOne({
          $or: [{ _id: from_user_id }, { _id: to_user_id }],
        })) || []
      // it is necessary to check that from_user_id and to_user_id are in the database
      if (select_users.length < 2) throw new UnAuthorizationError('from_user_id or to_user_id was not found in the database')
  
      const newMessage = await this.Message.create({
        from_user_id,
        to_user_id,
        message,
      })
  
      return res.status(201).send(JSON.stringify({
        status: 201,
        message: 'Message successfully created.',
        data: newMessage,
      }))
    } catch (error) {
      next(error);
    }
  }

  async editMessage(req, res, next) {
    try {
      const { id } = req.params
      const { message } = req.body
  
      const { error, data: updated_message } = await new Promise(resolve => {
        this.Message.findOneAndUpdate(
          { _id: id },
          { message },
          function (err, data) {
            return resolve(err, data)
          }
        )
      })
  
      if (error) return next(new MongooseInvalidDataError(error))
  
      return res.send(JSON.stringify({
        ok: true,
        message: 'message successfully edited.',
        data: updated_message,
      }))
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const { id } = req.params
      const { error, data: deleted_message } = await new Promise((resolve) => {
        this.Message.findOneAndDelete({ _id: id }, function (err, data) {
          return resolve({error: 1, data: data || {}});
        })
      })
      
      if (error) return next(new MongooseInvalidDataError(error))
      
      return res.send(JSON.stringify({
        ok: true,
        message: 'message successfully deleted.',
        data: deleted_message,
      })).status(200)
    } catch (error) {
      next(error);
    }
  }
}
