import mysql from 'mysql';
import config from './config.json' assert {type: 'json'};

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

export const handler = async (event, context) => {
  // TODO implement
  // context.callbackWaitsForEmptyEventLoop = false;
  console.log('AWS');
  let response = {
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*", // Allow from anywhere
      "Access-Control-Allow-Methods": "POST" // Allow POST request
    }
  };

  let info = event

  let loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Users WHERE username=? AND password=?", [username, password], (error, rows) => {
        console.log("ROWS: " + rows);
        if (error) { return reject(error); }
        if ((rows)) {
          // Check if the account is closed
          if (rows[0].isClosed === 'true') {
            return resolve(402);  // Account is closed
          } else if (rows[0].accountType === 'Seller') {
            return resolve(200);  // Seller login successful
          }
          else if (rows[0].accountType === 'Buyer') {
            return resolve(201); //Buyer login successful
          }
          else if (rows[0].accountType === 'Admin') {
            return resolve(202); //Admin login successful
          }
        }
        else {
          return resolve(400);
        }
      });
    });
  }

  try {
    if (!info.username) {
      response.statusCode = 400;
      response.error = "Username not provided";
      return response;
    }
    if (!info.password) {
      response.statusCode = 400;
      response.error = "Password not provided";
      return response;
    }
    let status;
    status = await loginUser(info.username, info.password);
    if (status === 200) {
      response.statusCode = 200;
      response.error = "Login Successful";
      return response;
    }
    else if (status === 201) {
      response.statusCode = 201;
      response.error = 'Login Successful';
      return response;
    }
    else if (status === 202){
      response.statusCode = 202;
      response.error = 'Admin Login Successful'
      return response;
    }
    else if (status === 402) {
      response.statusCode = 400;
      response.error = "Account has been closed";
      return response;
    }
    else {
      response.statusCode = 400;
      response.error = "The username or password is incorrect";
      return response;
    }
  }
  catch (error) {
    console.log("ERROR: " + error);
    response.statusCode = 400;
    response.error = error;
    return response;
  }
};
