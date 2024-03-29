import { Router } from "express";
import Multer from "multer";
import User from '../database/models/user.js'
import UsersController from "../controllers/user.js"
import { tokenValidation } from "../middlewares/token.validation.js"


const router = Router()
const Upload = Multer();
const userController = new UsersController(User)


router.get('/users', (req, res, next) => userController.getUsers(req, res, next))
router.get('/users/image', (req, res, next) => userController.getProfileImage(req, res, next));
router.get('/users/:id', (req, res, next) => userController.getUser(req, res, next))
router.post('/users/register', Upload.single('image'), (req, res, next) => userController.register(req, res, next));
router.post('/users/login', (req, res, next) => userController.login(req, res, next));
router.patch('/users/:id', (req, res, next) => userController.update(req, res, next))
router.patch('/users/update/socketID', tokenValidation, (req, res, next) => userController.updateUserSocketID(req, res, next));
router.delete('/users/:id', (req, res, next) => userController.delete(req, res, next))

router.delete('/users/delete/all', (req, res, next) => userController.deleteAllUsers(req, res, next));


export default router