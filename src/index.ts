import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { check, validationResult } from 'express-validator';
import { emailExists, insertUser, instertMarketingEmail } from './lib/db';
import { emailSuccessMessage, minPasswordLength, workFactor } from './constants';
import {hashSync} from "bcrypt";

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {

  res.send('Fres, nai-dobroto dnes!')

});

app.post('/register',
          check('email').exists()
          .isEmail()
          .withMessage('Invalid email address.'),

          check('password').exists()
          .isStrongPassword({'minLength': minPasswordLength})
          .withMessage(`Please choose a password that is at least ${minPasswordLength} characters containing, an upper and lower case letters, special characters and numbers.`),
async (req: Request, res: Response) => {
  
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    
    if (await emailExists(email)) {
      res.status(200).json({message: ['Email already in use.']});
    } else {
      const hashedPassword = hashSync(password, workFactor);    
      await insertUser(email, hashedPassword)
      res.status(200).json({message: ['Registered successfully.']});
    }

  } else {
    res.status(500).json({message: errors});
  }

});

app.post('/emailSubscribe',
        check('email').exists()
                      .isEmail(),
async (req: Request, res: Response) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { email } = req.body;

    if (await emailExists(email)) {
      res.status(200).json({message: ["Thanks, you are already subscribed."]}); 
    } else {
      instertMarketingEmail(email);
      res.status(200).json({message: [emailSuccessMessage]}); 
    }
    
    
  } else {
    res.status(422).json({message: ['Please provide a valid email.']});
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});