import Message from "../database/models/message.js";

export default class MessageService {
  constructor () {
    this.MessageRepository = Message;
  }

  async getMessage(filter) {
    try {
      const message = await this.MessageRepository.findOne(filter);
      return message;
    } catch (error) {
      throw error;
    }
  }

  async getMessages(filter) {
    try {
      const messages = await this.MessageRepository.find(filter);
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
      
      for(const message of messages) {
        const deleted_message = await MESSAGE_REPOSITORY.findOneAndDelete({ _id: message._id });
        deleted_messages.push(deleted_message)
      }
      
      return deleted_messages;
    } catch (error) {
      throw error;
    }
  }

  async deleteAllMessages() {
    const all_messages = await this.getMessages();
    
    for (const message of all_messages)
      await this.deleteMessage({ _id: message._id }); // delete all message

    return all_messages;
  }
}