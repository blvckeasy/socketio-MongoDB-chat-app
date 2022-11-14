import UsersStatisticsService from '../services/user.statistics.js';
import { NotFoundException, UnAuthorizationError } from '../helpers/error.js';
import UsersService from '../services/user.js';


export default class UsersStatisticsController {
  constructor () {
    this.usersStatisticsService = new UsersStatisticsService(); 
    this.usersService = new UsersService();
  }

  async getUserStatistics(req, res, next) {
    try {
      const { user_id } = req.params;
      if (user_id) throw new NotFoundException("user_id is require!");

      const found_user = await this.usersService.getUser({ _id: user_id });
      if (!found_user) throw new UnAuthorizationError("user not found!");

      const statistics = await this.usersStatisticsService.getUserStatistics({ user_id });
      return res.send({
        ok: true,
        data: statistics,
      }).status(200);
    } catch (error) {
      next(error);
    }
  }

  async postUserStatistics(req, res, next) {
    try {
      const { token } = req;
      // const { user_id } = await this.usersService.postUserStatistics({  })
    
      console.log(token);

    } catch (error) {
      next(error);
    }
  }
}