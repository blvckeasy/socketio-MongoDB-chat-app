import Message from "../database/models/message.js";
import { UnAuthorizationError } from "../helpers/error.js"

export default class MessageService {
  constructor () {
    this.MessageRepository = Message;
  }

  async getMessages(skip = 1, limit = 10) {
    try {
      const messages = await this.MessageRepository.find().limit(limit).skip(skip);
      return messages;
    } catch (error) {
      throw error;
    }
  }

  async getUserMessages(from_user_id, to_user_id) {
    try {
      if (!(from_user_id && to_user_id)) throw UnAuthorizationError("from_user_id & to_user_id is require!");
      const found_messages = await this.MessageRepository.find({ from_user_id, to_user_id });

      return found_messages;
    } catch (error) {
      throw error;
    }
  }

  async postMessage(from_user_id, to_user_id, message) {
    try {
      const message = await this.MessageRepository.create({ from_user_id, to_user_id, message });
      return message;
    } catch (error) {
      throw error;
    }
  }

  async patchMessage(_id, message) {
    try {
      // update message
      await this.MessageRepository.findOneAndUpdate({ _id }, { message })
      const found_message = await this.MessageRepository.findOne({ _id });

      return found_message;
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(_id) {
    try {
      const message = await this.MessageRepository.findOneAndDelete({ _id });
      
      return message;
    } catch (error) {
      throw error;
    }
  }

  async deleteChat(from_user_id, to_user_id) {
    try {
      const MESSAGE_REPOSITORY = this.MessageRepository;
      const messages = await this.MessageRepository.find({ from_user_id, to_user_id });
      let deleted_messages = [];
      
      messages.forEach(async function (message) {
        const deleted_message = await MESSAGE_REPOSITORY.findOneAndDelete({ _id: message._id });
        deleted_message.push(deleted_message);
      });

      return deleted_messages;
    } catch (error) {
      throw error;
    }
  }
}