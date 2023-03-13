import { createConnection } from "mysql";
import { serverConfig } from "../../serverConfig";

const connection = createConnection({
  host: serverConfig.dbHost,
  port: Number(process.env.DB_PORT),
  user: serverConfig.dbUser,
  password: serverConfig.dbPassword,
  database: serverConfig.dbName
});

// Database tables:
const MARKETING_EMAILS = 'marketing_emails';

export const instertMarketingEmail = async (email: string) => {

    connection.query(`INSERT INTO ${MARKETING_EMAILS} (email) VALUES (?)`, 
    [email],
    function (error: any, results) {

      if (error && error.code === 'ER_DUP_ENTRY') {
        console.error(`Duplicate entry email: ${email}`);
        return "Email already in use.";
      }
      
      console.log('Email registered successfully: ', results);

    });

}

export function emailExists(email: string) {
// Check if an email already exists in a database table.
  return new Promise((resolve, reject) => {
    connection.query(`SELECT COUNT(*) AS count FROM ${MARKETING_EMAILS} WHERE email = ?`, email, function (error, results, fields) {
      if (error) reject(error);
      const count = results[0].count;
      resolve(count > 0);
    });
  });

}
