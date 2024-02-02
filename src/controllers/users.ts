import bcrypt from 'bcrypt';
import { Router, Request, Response } from 'express';
import User from '../model/User';

const usersRouter: Router = Router()

usersRouter.post('/', async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        
        const { username, password } = req.body;
    
        // encrypt the password
        const saltRounds: number = 10;
        const passwordHash: string = await bcrypt.hash(password, saltRounds);
    
        // add a new user to the database
        const user: User = await User.create({
          username,
          passwordHash,
        });
    
        res.status(201).json(user);

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

export default usersRouter