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

  // UNPUBLISH  ITEM
  let unpublishItemSeller = (itemID) => {
    console.log(itemID);
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE Items SET isPublished = ?, isActive = ?, startDate = ? WHERE id = ? AND bids IS NULL",["false", "false", null, itemID], 
        (err, result) => {
          if (err) {
            reject(err); // Reject the promise on error
          } else if (result.affectedRows === 0){
            reject(new Error("Cannot unpublish item: Either item not found or bids is not null")); // Custom error for specific case
          } else {
            resolve(200); // Resolve with success status
          }
        }
      );
    });
  };
 
  try {

    if (!info) {
      response.statusCode = 400;
      response.error = "something missing in request";
      return response;
    }

    let status;
    status = await unpublishItemSeller(info.itemID);
    if (status === 200) {
      response.statusCode = 200;
      response.error = "unpublishItem success" //not actually error, but for messaging purposes

      return response;
    } else {
      response.statusCode = 400;
      response.error = "unpublishItem database error";

      return response;
    }

    // }

  } catch (error) {
    console.log("ERROR: " + error);
    response.statusCode = 400;
    response.error = error.message;

    return response;
  }

};