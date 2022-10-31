import { Router } from "express";
import User from '../database/models/user.js'

const router = Router()

function UnAuthorizationError() {
  return {
    status: 400,
    ok: false,
    message: "username or password invalid",
  }
}

router.get('/users', async (_, res) => {
  const users = await User.find();
  return res.send({
    status: 200,
    ok: true,
    message: "OK.",
    data: users || []
  })
})

router.get('/users/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id: id })

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
})

router.post('/users/register', async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) return res.send(UnAuthorizationError(res));

  const found_user = await User.findOne({ username })
  
  if (!found_user) {
    const user = await User.create({ username, password })
    return res.send({
      status: 200,
      ok: true,
      message: "user successfully registered.",
      data: user
    });
  }

  return res.send({
    status: 400,
    ok: false,
    message: `"${username}" is already sign in`,
    user: {}
  })
});

function checkPassword(user, password) {
  user.comparePassword(password, function (err, isMatch) {
    if (err) throw err;

    return isMatch
  })
}

router.post('/users/login', async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) return res.send(UnAuthorizationError());
  
  new Promise(async (resolve, reject) => {
    await User.findOne({ username }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return reject();
      }

      user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;

          if (isMatch) {
            return resolve(user)
          }
          return reject(UnAuthorizationError())
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

})

function compare (candidatePassword, password, cb) {
  bcrypt.compare(candidatePassword, password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
}

router.patch('/users/:id', async (req, res) => {
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
    User.findOne({ _id: id }, function (err, user) {
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
      const found_username = await User.findOne({ username }).clone();
      if (found_username) {
        return res.send({
          status: 400,
          ok: false,
          message: `"${username}" already taken.`,
        })
      }
    }

    const updated_user = await User.findOneAndUpdate({ _id: id }, { username, password }).clone();
  
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

})


export default router