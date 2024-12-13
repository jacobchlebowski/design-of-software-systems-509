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


  //ADD FUNDS HERE
  let addFunds = (username, funds) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE Users SET balance = balance + ? WHERE username = ?", [funds, username], (err) => {
          if (err) {
            return resolve(400);
          } else {
            return resolve(200);
          }
        }
      );
    });
  };

  try {

    let status;
    status = await addFunds(info.username,info.funds);
    if (status === 200) {
      response.statusCode = 200;
      response.error = "addFunds success" //not actually error, but for messaging purposes

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