import { createConnection } from "mysql";
import { serverConfig } from "../../serverConfig";

const connection = createConnection({
  host: serverConfig.dbHost,
  port: Number(process.env.DB_PORT),
  user: serverConfig.dbUser,
  password: serverConfig.dbPassword,
  database: serverConfig.dbName
});

// connection.connect();

const MARKETING_EMAILS = 'marketing_emails';
const USERS = 'users';

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

export const insertUser = async (email: string, hashedPassword: string) => {

 connection.query(`INSERT INTO ${USERS} (email, password, is_admin) VALUES (?, ?, ?)`, 
  [email, hashedPassword, null],
  function (error: any, results) {

    try {
      if (error && error.code === 'ER_DUP_ENTRY') {
        console.error(`Duplicate entry email: ${email}`);
        return "Email already in use.";
      } else if (error) {
        console.error(`Duplicate entry email: ${email}`);
        return "An unexpected error occured, please try again later.";
      } else {
        console.log('User registered successfully: ', results);
        return "Successful registration";
      }
    } catch(error: any) {
      throw new Error(error.message);
    }
    
  });
}

export function emailExists(email: string) {

  return new Promise((resolve, reject) => {
    connection.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', email, function (error, results, fields) {
      if (error) reject(error);
      const count = results[0].count;
      resolve(count > 0);
    });
  });

}

// function emailExists(email: string) {
//   connection.query(`SELECT COUNT(*) AS cnt FROM ${USERS} WHERE email = ?`, 
//   [email] , function(err , data){
//     if(err){
//         console.log(err);
//     }   
//     else{
//         if(data[0].cnt > 0){  
//               // Already exist 
//         }else{
//             connection.query("INSERT INTO ..." , function(err , insert){
//                 if(err){
//                     return "An unexpected error occured."
//                     // retunn error
//                 }else{

//                     // return success , user will insert 
//                 }
//             })                  
//         }
//     }
//   })
// }