import mysql from 'mysql';
import config from './config.json' assert { type: 'json' };

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

export const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  let response = {
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*", // Allow from anywhere
      "Access-Control-Allow-Methods": "POST" // Allow POST request
    }
  };

  let info = event
  
  let fulfillItem = (itemID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Items WHERE id=?", [itemID], (err, rows, fields) => {  
        if (err) {
          console.error("Query 1 Failed", err);
          return reject("Query 1 Failed");
        }
        console.log(rows);
        if (rows) {
          const today = new Date();
          const todayFormatted = today.toISOString().split('T')[0];
          console.log('DATE', todayFormatted);
          pool.query("SELECT balance FROM Users WHERE username = ?", [rows[0].username], (err, rowsSeller, userFields) => {
            if (err) {
              console.error("Query 2 Failed", err);
              return reject("Query 2 Failed");
            }
            console.log("")
            if (rowsSeller) {
              if ((todayFormatted > rows[0].endDate)) { //Need to add check that the buyer has enough
                return resolve(200);
              } else {
                return resolve(409);
              }
            } else {
              return resolve(400);
            }
          });
        } else {
          return resolve(400);
        }
      });
    });
  };
  
  
  try {
    let status;

    status = await fulfillItem(info.itemID);
    if (status === 200) {
      response.statusCode = 200;
      response.error = "Item Fulfilled";
      return response;
    }
    else if (status === 409) {
      response.statusCode = 409;
      response.error = 'End Date not Reached';
      return response;
    }
    else{
      response.statusCode = 400;
      response.error = "Item could not be fulfilled";
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

