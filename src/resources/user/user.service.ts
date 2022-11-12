import UserModel from '@/resources/user/user.model';
import { createToken } from '@/utils/token';

export default class UserService {
  private user = UserModel;

  public async register(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.user.create({ email, password });
      const accessToken = createToken(user);

      return accessToken;
    } catch (e: any) {
      throw new Error('Unable to create user');
    }
  }

  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.user.findOne({ email });

      if (!user) throw new Error('Unable to find user');

      if (await user.isValidPassword(password)) return createToken(user);
      else throw new Error('Wrong credentials');
    } catch (e: any) {
      throw new Error('Unable to login user');
    }
  }
}
