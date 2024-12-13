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

  const formatDateToEasternTime = (date) => {
    // Use Intl.DateTimeFormat to get Eastern Time components
    const options = {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24-hour format
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(date);

    // Extract formatted parts
    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;
    const hour = parts.find((p) => p.type === "hour").value;
    const minute = parts.find((p) => p.type === "minute").value;

    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  // PUBLISH ITEM
  let publishItemSeller = (itemID) => {
    console.log(itemID);
    let currentDate = new Date()
    const formattedDate = formatDateToEasternTime(currentDate);
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE Items SET isPublished = ?, isActive = ?, startDate = ? WHERE id = ?",["true", "true", formattedDate, itemID], 
        (err) => {
          if (err) {
            reject(err); // Reject the promise on error
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
    status = await publishItemSeller(info.itemID);
    if (status === 200) {
      response.statusCode = 200;
      response.error = "publishItem success" //not actually error, but for messaging purposes

      return response;
    } else {
      response.statusCode = 400;
      response.error = "publishItem database error";

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