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

  // get raw value or, if a string, then get from database if exists.
  let ComputeArgumentValue = (value) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Users WHERE username=?", [value], (error, rows) => {
        if (error) { return reject(error); }
        if ((rows) && (rows.length >= 1)) {
          return resolve("username already exists");
        } else {
          return resolve(null); //no user found matching this username
        }
      });
    });
  };

  //REMOVE ITEM HERE
  let removeInactiveItemSeller = (itemId) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Items WHERE id=?", [itemId], (err) => {
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
      response.error = "item missing in request";
      return response;
    }

    let status;
    status = await removeInactiveItemSeller(info.itemId);
    if (status === 200) {
      response.statusCode = 200;
      response.error = "remove inactive item success" //not actually error, but for messaging purposes

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