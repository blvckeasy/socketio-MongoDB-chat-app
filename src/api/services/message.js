import Message from "../database/models/message.js";
import { UnAuthorizationError } from "../helpers/error.js"

export default class MessageService {
  constructor () {
    this.MessageRepository = Message;
  }

  async getMessages(filter, skip = 1, limit = 10) {
    try {
      const messages = await this.MessageRepository.find(filter).limit(limit).skip(skip);
      return messages;
    } catch (error) {
      throw error;
    }
  }

  async getUserMessages(filter) {
    try {
      const found_messages = await this.MessageRepository.find(filter);

      return found_messages;
    } catch (error) {
      throw error;
    }
  }

  async postMessage(params) {
    try {
      const message = await this.MessageRepository.create(params);
      return message;
    } catch (error) {
      throw error;
    }
  }

  async patchMessage(filter, update) {
    try {
      // update message
      await this.MessageRepository.findOneAndUpdate(filter, update);
      const found_message = await this.MessageRepository.findOne(filter);

      return found_message;
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(params) {
    try {
      const message = await this.MessageRepository.findOneAndDelete(params);
      
      return message;
    } catch (error) {
      throw error;
    }
  }

  async deleteChat(params) {
    try {
      const MESSAGE_REPOSITORY = this.MessageRepository;
      const messages = await this.MessageRepository.find(params);
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