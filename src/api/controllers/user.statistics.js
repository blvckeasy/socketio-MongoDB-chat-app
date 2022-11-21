import UsersStatisticsService from '../services/user.statistics.js';
import { NotFoundException, UnAuthorizationError } from '../helpers/error.js';
import UsersService from '../services/user.js';
import { verifyToken } from '../helpers/jwt.js'


export default class UsersStatisticsController {
  constructor () {
    this.usersStatisticsService = new UsersStatisticsService(); 
    this.usersService = new UsersService();
  }

  async getUserStatistics(req, res, next) {
    try {
      const { user_id, start_time, end_time } = req.params;
      if (!user_id) throw new NotFoundException("user_id is require!");

      const found_user = await this.usersService.getUser({ _id: user_id });
      if (!found_user) throw new UnAuthorizationError("user not found!");

      const statistics = await this.usersStatisticsService.getUserStatistics({
        user_id,
        $and: [
          { SignIn_time: { $gte: start_time || found_user.registered_date } },
          { Exit_time: { $lte: end_time || Date.now() } }
        ]
      });
      return res.send({
        ok: true,
        data: statistics,
      }).status(200);
    } catch (error) {
      next(error);
    }
  }

  async userConnected(req, res, next) {
    try {
      let { user, token } = req;
      
      if (!(user && token)) throw new NotFoundException("token is require!");
      if (!user) user = verifyToken(token);


      const  found_user = await this.usersService.getUser({ _id: user._id });
      if (!found_user) throw new UnAuthorizationError("user not found!");

      // get all incomplete statistics
      const incomplete_statistics = await this.usersStatisticsService.getUserStatistics({ Exit_time: null })
    
      if (incomplete_statistics) {
        const USER_STATISTICS_SERVICE = this.usersStatisticsService
        incomplete_statistics.forEach(async function (statistic) {
          await USER_STATISTICS_SERVICE.deleteUserStatistics({
            $and: [
              { _id: statistic._id },
              { Exit_time: null }
            ]
          });
        })
      }

      const statistics = await this.usersStatisticsService.postUserStatistics({ user_id: user._id });
      user.status = "online";

      return res.send({
        ok: true,
        message: "user is successfully connected",
        data: {
          user,
          statistics
        }
      }).status(200);
    } catch (error) {
      next(error);
    }
  }
  
  async userDisconnected(req, res, next) {
    try {
      let { user, token } = req;
      
      if (!(user && token)) throw new NotFoundException("token is require!");
      if (!user) user = verifyToken(token);
      
      const found_user = await this.usersService.getUsers({ _id: user._id });
      if (!found_user) throw new UnAuthorizationError("user not found!");

      const found_statistic = await this.usersStatisticsService.getUserStatistics({
        $and: [
          { user_id: user._id },
          { Exit_time: null },
        ]
      })
      if (!found_statistic.length) throw new NotFoundException("The user is not online!");

      // update user status from offline
      await this.usersStatisticsService.patchUserStatistics({
        $and: [
          { user_id: user._id },
          { Exit_time: null },
        ],
      }, { Exit_time: Date.now() });
      user.status = "offline";

      const user_last_statistics = await this.usersStatisticsService.getUserLastStatistic({ user_id: user._id });
      return res.send({ 
        ok: true,
        message: "user is successfully disconnected",
        data: {
          user,
          statistic: user_last_statistics,
        }
      }).status(200);
    } catch (error) {
      next(error);
    }
  }
}