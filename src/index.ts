import express, { Express, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { emailExists, instertMarketingEmail } from './lib/db';
import { emailSuccessMessage, minPasswordLength, workFactor } from './constants';

// Additional libraries used - express-validator, bcrypt js.

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json({limit: '2kb'}));

app.post('/register',
async (req: Request, res: Response) => {

  res.status(200).json({message: ['Registered successfully.']});
});

app.post('/login', async (req: Request, res: Response) => {

  // TODO - verify that the user exists and return some verification token.
  res.status(200).json({message: ['User logged in successfully.']});
});

app.get('/allProducts', async (req: Request, res: Response) => {

  // TODO - should list all products.
  res.status(200).json({message: 
    [
      {title: "product title", imageUrl: "product url", description: 'product description.'},
      {title: "product title", imageUrl: "product url", description: 'product description.'}
  ]});
});

app.post('/emailSubscribe',
      // The 2 following lines are from: https://express-validator.github.io/docs/
      // https://express-validator.github.io/docs/validation-chain-api/#existsoptions
      // https://express-validator.github.io/docs/validation-chain-api/#standard-validators
        check('email').exists()
                      .isEmail(),
async (req: Request, res: Response) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { email } = req.body;

    if (await emailExists(email)) {
      res.status(409).json({message: ["Thanks, you are already subscribed."]}); 
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