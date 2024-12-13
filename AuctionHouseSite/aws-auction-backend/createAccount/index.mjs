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

  // Check if username and password are present
  if (!info.username || !info.password) {
    response.statusCode = 400;
    response.error = "Missing required fields username, password";
    return response;
  }
  // Check if the accountType selected
  if (info.accountType === "Select an option") {
    response.statusCode = 400;
    response.error = "Must select account type";
    return response;
  }

  // get raw value or, if a string, then get from database if exists.
  let usernameExists = (username) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Users WHERE username=?", [username], (error, rows) => {
        if (error) { return reject(error); }
        if ((rows) && (rows.length >= 1)) {
          return resolve("username already exists");
        } else {
          return resolve(null); //no user found matching this username
        }
      });
    });
  };


  let createSeller = (username,password) => {

    return new Promise((resolve, reject) => {
      pool.query( "INSERT INTO Users SET username=?, password=?, accountType=?, balance=? ,isClosed=? ,items=? ,bids=?", [username, password, "Seller", "100", "false",null,null], (err) => {
        if (err) {
          return resolve(401);
        }
        else {
          return resolve(200);
        }
      });
    });

  };

  
  let openBuyer = (username,password) => {

    return new Promise((resolve, reject) => {
      
      pool.query( "INSERT INTO Users SET username=?,password=?, accountType=?, balance=?,isClosed=?,items=?,bids=?", [username, password,"Buyer", "100", "false",null,null], (err) => {
        if (err) {
          return resolve(402);
        }
        else {
          return resolve(200);
        }
      });
    });

  };

  try {
    // Check if username exists
    const usernameAlreadyExists = await usernameExists(info.username);
    if (usernameAlreadyExists) {
      response.statusCode = 409; // Conflict
      response.error = "Username already exists";
      return response;
    }
		
    let status;
    if (info.accountType === "Seller") {
      status = await createSeller(info.username, info.password);
    } else if (info.accountType === "Buyer") {
      status = await openBuyer(info.username, info.password);
    } else {
      response.statusCode = 400;
      response.error = "Invalid account type";
      return response;
    }
    // Return appropriate response based on status
    if (status === 200) {
      response.statusCode = 200;
      response.message = "Account successfully created";
      return response;
    } else if (status === 401 || status === 402) {
      response.statusCode = 400;
      response.error = "Database error";
      return response;
    }

  } catch (error) {
    console.log("ERROR: " + error);
    response.statusCode = 500;
    response.error = "Internal server error";
    return response;
  }
};