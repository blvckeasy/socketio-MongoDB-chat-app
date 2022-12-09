import { Router } from "express";
import User from '../database/models/user.js'
import UsersController from "../controllers/user.js"

const router = Router()
const userController = new UsersController(User)

router.get('/users', (req, res, next) => userController.getUsers(req, res, next))
router.get('/users/:id', (req, res, next) => userController.getUser(req, res, next))
router.post('/users/register', (req, res, next) => userController.register(req, res, next));
router.post('/users/login', (req, res, next) => userController.login(req, res, next));
router.patch('/users/:id', (req, res, next) => userController.update(req, res, next))
router.patch('/users/update/socketID', (req, res, next) => userController.updateUserSocketID(req, res, next));
router.delete('/users/:id', (req, res, next) => userController.delete(req, res, next))

router.delete('/users/delete/all', (req, res, next) => userController.deleteAllUsers(req, res, next));


export default router