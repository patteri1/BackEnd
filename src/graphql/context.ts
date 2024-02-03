import jwt from 'jsonwebtoken';
import { Request } from 'express'

export interface MyContext {
    user?: {
      userId: number;
      username: string;
      UserRoleId: number;
    };
}

const getTokenFrom = (req: Request) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }

  return null
}

export const createContext = async ({ req }: { req: Request}): Promise<MyContext> => {
  const context: MyContext = {};
  const token: string | null = getTokenFrom(req)

  if (token !== null) {
    try {        
      const decoded = jwt.verify(token, process.env.SECRET!);
      context.user = decoded as MyContext['user'];

    } catch (error) {
      console.error('Invalid token');
    }
  }


  return context;
};
