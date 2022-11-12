import jwt from 'jsonwebtoken';

import User from '@/resources/user/user.interface';
import Token from '@/utils/interfaces/token.interface';

export const createToken = (user: User): string =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET as jwt.Secret);

export const verifyToken = async (token: string): Promise<jwt.VerifyErrors | Token> =>
  new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) return rej(err);

      res(payload as Token);
    });
  });
