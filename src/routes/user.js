import { Router } from "express";
import User from '../database/models/user.js'

const router = Router()

router.post('/users/register', async (req, res) => {
  const { username, password } = req.body;
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

router.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  new Promise(async (resolve, reject) => {
    await User.findOne({ username }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return reject("user not found.");
      }

      user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;

          if (user) {
            delete user.password
          }

          return resolve(user)
      });
    }).clone();
  }).then((user) => {
    if (user) {
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
    return res.send({
      status: 400,
      ok: false,
      error: err,
    })
  })

})

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


export default router