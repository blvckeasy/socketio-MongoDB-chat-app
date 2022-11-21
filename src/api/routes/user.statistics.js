import { Router } from "express";
import UsersStatisticsController from '../controllers/user.statistics.js'; 
import { tokenValidation } from "../middlewares/token.validation.js";

const router = Router();
const usersStatisticsController = new UsersStatisticsController();

router.get("/userStatistics/", (req, res, next) => usersStatisticsController.getUserStatistics(req, res, next));
router.post("/userStatistics/connect", tokenValidation, function (req, res, next) {
  return usersStatisticsController.userConnected(req, res, next);
})

router.post("/userStatistics/disconnect", tokenValidation, function (req, res, next) {
  return usersStatisticsController.userDisconnected(req, res, next);
})

router.post("/userStatistics/:user_id", (req, res, next) => usersStatisticsController.getUserStatistics(req, res, next));


export default router;