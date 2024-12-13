import mysql from 'mysql';

import config from './config.json' assert { type: 'json' };

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

export const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // ready to go for CORS. To make this a completed HTTP response, you only need to add a statusCode and a body.
  let response = {
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*", // Allow from anywhere
      "Access-Control-Allow-Methods": "POST" // Allow POST request
    }
  }; // response

  let info = event


  //GET BALANCE
  let getBalance = (username, funds) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT balance FROM Users WHERE username = ?", [username], (err, rows) => {
          if (err) {
            return resolve({statusCode: 400, error: "User not found"});
          } else {
            return resolve({statusCode: 200, balance: rows[0].balance});
          }
        }
      );
    });
  };

  try {

    let status;
    status = await getBalance(info.username);
    if (status.statusCode === 200) {
      response.statusCode = 200;
      response.error = "getBalance success" //not actually error, but for messaging purposes
      response.value = status.balance;

      return response;
    } else {
      response.statusCode = 400;
      response.error = "database error";

      return response;
    }

  } catch (error) {
    console.log("ERROR: " + error);
    response.statusCode = 400;
    response.error = error;

    return response;
  }

};
