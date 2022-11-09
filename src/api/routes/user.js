import { Router } from "express";
import User from '../database/models/user.js'
import UsersController from "../controllers/user.js"

const router = Router()
const userController = new UsersController(User)

router.get('/users', (req, res) => userController.getUsers(req, res))
router.get('/users/:id', (req, res) => userController.getUser(req, res))
router.post('/users/register', (req, res) => userController.register(req, res));
router.post('/users/login', (req, res) => userController.login(req, res))
router.patch('/users/:id', (req, res) => userController.update(req, res))
router.delete('/users/:id', (req, res) => userController.delete(req, res))


export default router