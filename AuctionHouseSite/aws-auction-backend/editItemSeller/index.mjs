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



    //EDIT ITEM
    let editItemSeller = (sellerUsername, itemID, itemName, imageUrl, description, price, startDate, endDate, buyNow) => {
      return new Promise((resolve, reject) => {
        pool.query(
          "UPDATE Items SET itemName = ?, imageUrl = ?, description = ?, price = ?, startDate = ?, buyNow = ?, endDate = ? WHERE id = ? AND sellerUsername = ? AND isActive = ? AND isFrozen = ?",
          [itemName, imageUrl, description, price, startDate, buyNow, endDate, itemID, sellerUsername, "false", "false"],
          (err, results) => {
            if (err) {
              return resolve(400);
            }
            if (results.affectedRows === 0) {
              // No rows updated, itemID not found or conditions not met
              return resolve(400);
            } else {
              return resolve(200);
            }
          }
        );
      });
    };


  try {

    if (!info) {
      response.statusCode = 400;
      response.error = "item missing in request";
      return response;
    }

    let status;
    status = await editItemSeller(info.sellerUsername,info.itemID,info.itemName,info.imageUrl,info.description,info.price,info.startDate,info.endDate,info.buyNow);
    if (status === 200) {
      response.statusCode = 200;
      response.error = "editItem success" //not actually error, but for messaging purposes

      return response;
    } else {
      response.statusCode = 400;
      response.error = "incorrect item ID, or item is already published";

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