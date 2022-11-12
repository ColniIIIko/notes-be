import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import ValidationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';

export default class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private userService = new UserService();

  constructor(subControllers?: Controller[]) {
    this.initialiseRoutes();
    subControllers &&
      subControllers.length &&
      this.initialiseSubControllers(subControllers);
  }

  private initialiseSubControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.router.use(controller.path, authenticated, controller.router);
    });
  }

  private initialiseRoutes() {
    this.router.post('/register', ValidationMiddleware(validate.register), this.register);
    this.router.post('/login', ValidationMiddleware(validate.login), this.login);
    this.router.get('/', authenticated, this.getUser);
  }

  private register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.register(email, password);

      res.status(201).json({ token });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);

      res.status(200).json({ token });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private getUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpException(404, 'No logged in user'));
    }

    res.status(200).json({ user: req.user });
  };
}
