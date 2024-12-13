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

  let closeBuyer = (user) => {

    return new Promise((resolve, reject) => {
      pool.query("UPDATE Users SET isClosed=? WHERE username=?", ["true", user], (err) => {
        if (err) {
          return resolve(400);
        }
        else {
          return resolve(200);
        }
      });
    });

  };

  try {

    if (!info) {
      response.statusCode = 400;
      response.error = "Username missing in request";
      return response;
    }

    let status;
    status = await closeBuyer(info.buyerUsername);
    if (status === 200) {
      response.statusCode = 200;
      response.error = info.balance;

      return response;
    } else {
      response.statusCode = 400;
      response.error = "database error";

      return response;
    }

    // }

  } catch (error) {
    console.log("ERROR: " + error);
    response.statusCode = 400;
    response.error = error;

    return response;
  }

};