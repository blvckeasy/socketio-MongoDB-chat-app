export default class MessageController {
  constructor (MessageRepository, UserRepository) {
    this.Message = MessageRepository;
    this.User = UserRepository;
  }

  async getMessages(req, res) {
    const { to_user_id, from_user_id, id } = req.query
    
    if (to_user_id && from_user_id) {
      const messages = await this.Message.find({ from_user_id, to_user_id });
      return res.send(messages || []);
    }
    if (id) {
      const message = await this.Message.findOne({ _id: id }).clone();
      return res.send(message || {});
    }
    
    const messages = await this.Message.find().clone();
    return res.send(messages || []);
  }

  async postMessage(req, res) {
    const { from_user_id, to_user_id, message } = req.body;
    if (!(from_user_id && to_user_id && message)) return res.send("req body null");

    const select_users = await this.User.findOne({ $or: [{ _id: from_user_id }, {_id: to_user_id}] }) || [];
    // it is necessary to check that from_user_id and to_user_id are in the database
    if (select_users.length < 2) {
      return res.send("from_user_id or to_user_id was not found in the database");
    }

    const newMessage = await this.Message.create({ from_user_id, to_user_id, message });

    return res.status(201).send({
      status: 201,
      message: "Message successfully created.",
      data: newMessage
    });
  }

  async editMessage(req, res) {
    const { id } = req.params;
    const { message } = req.body;

    const updated_message = await this.Message.findOneAndUpdate({ _id: id }, { message });

    return res.send(updated_message);
  }

  async deleteMessage(req, res) {
    const { id } = req.params;

    const deleted_message = await this.Message.findOneAndDelete({ _id: id });

    return res.send(deleted_message);
  }
}