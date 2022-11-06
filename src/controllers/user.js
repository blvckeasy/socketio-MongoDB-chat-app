export default class UsersController {
  constructor(UserRepository) {
    this.User = UserRepository;
  }

  async getUsers(_, res) {
    try {
      const users = await this.User.find().clone();
      users.map((user) => user.password = undefined)
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

  async getUser(req, res) {
    try {
      const { id } = req.params
      if (!id) return res.send("id is require!");
  
      const user = await this.User.findOne({ _id: id });
      user.password = undefined
  
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

  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!(username && password)) return res.send(CustomError.UnAuthorizationError());
      
      new Promise(async (resolve, reject) => {
        await this.User.findOne({ username }, function (err, user) {
          if (err) throw err;
          if (!user) {
            return reject();
          }
  
          user.comparePassword(password, function(err, isMatch) {
              if (err) throw err;
  
              if (isMatch) {
                return resolve(user)
              }
              return reject(CustomError.UnAuthorizationError())
          });
        }).clone();
      }).then(async (user) => {
        if (user) {
          user.password = undefined
  
          return res.send({
            status: 200,
            ok: true,
            message: "The user successfully finded.",
            data: user
          });
        } else {
          return {
            status: 404,
            ok: false,
            message: "The user is not registered.",
            data: {}
          }
        }
      }).catch((err) => {
        console.log('err', err)
        return res.send({
          status: 400,
          ok: false,
          error: err,
        })
      })
    } catch (error) {
      next(error);
    }
  }

  async register(req, res) {
    try {
      const { username, password } = req.body;
      if (!(username && password)) return res.send(CustomError.UnAuthorizationError());
  
      const found_user = await this.User.findOne({ username })
      
      if (!found_user) {
        try {
          const user = await this.User.create({ username, password })
          return res.send({
            status: 200,
            ok: true,
            message: "user successfully registered.",
            data: user
          });
        } catch (error) {
          console.log(error);
          return res.send({
            status: 400,
            ok: false,
            error,
            data: {}
          })  
        }
      }
  
      return res.send({
        status: 400,
        ok: false,
        message: `"${username}" is already sign in`,
        user: {}
      })
    } catch (error) {
      next(error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      if (!id) return res.send("id not defined");
      const { username, password, old_password } = req.body
      
      if (!old_password) {
        return res.send({
          status: 400,
          ok: false,
          message: "old_password is require!",
        })
      }
  
      new Promise((resolve, reject) => {
        this.User.findOne({ _id: id }, function (err, user) {
          if (err) throw err;
        
          if (!user) {
            return reject("user not defined");
          }
  
          user.comparePassword(old_password, function(err, isMatch) {
            if (err) throw err;
            return isMatch ? resolve(user) : reject("invalid old_password");
          })
        }).clone();
      }).then(async (user) => {
        if (username) {
          const found_username = await this.User.findOne({ username }).clone();
          if (found_username) {
            return res.send({
              status: 400,
              ok: false,
              message: `"${username}" already taken.`,
            })
          }
        }
  
        const updated_user = await this.User.findOneAndUpdate({ _id: id }, { username, password }).clone();
        return res.send({
          status: 200,
          ok: true,
          data: updated_user,
        })
      }).catch((err) => {
        return res.send({
          status: 400,
          ok: false,
          error: err,
        })
      })
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params

      const user = await this.User.findOne({ _id: id }).clone()
      
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
    
      
      const deleted_user = await this.User.findOneAndDelete({ _id: id });
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
}