import { Router } from "express";
import UsersStatisticsController from '../controllers/user.statistics.js'; 
import { tokenValidation } from "../middlewares/token.validation.js";

const router = Router();
const usersStatisticsController = new UsersStatisticsController();

router.get("/userStatistics", (req, res, next) => usersStatisticsController.getUserStatistics(req, res, next));
router.post("/userStatistics", tokenValidation, (req, res, next) => usersStatisticsController.postUserStatistics(req, res, next));

export default router;