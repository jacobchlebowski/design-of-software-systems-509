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

  // Search Item Customer
  let searchItemCustomer = (data) => {
    return new Promise((resolve, reject) => {
      let query ='';
      let params = [];
      
      

      switch  (data.InputType) {
        case "itemName":
          query = 'SELECT * FROM Items WHERE itemName LIKE ? AND isActive = "true" AND isPublished = "true"';
          params = [`%${data.itemNameInput}%`];
          break;

        case "itemDescription":
          query = 'SELECT * FROM Items WHERE description LIKE ? AND isActive = "true" AND isPublished = "true"';
          params = [`%${data.itemDescriptionInput}%`];
          break;
        case "itemPrice":
          query = 'SELECT * FROM Items WHERE price BETWEEN ? AND ? AND isActive = "true" AND isPublished = "true"';
          const minPrice1 = Number(data.itemPriceLowInput);
          const maxPrice1 = Number(data.itemPriceHighInput);
          params = [minPrice1, maxPrice1];
          break;
          case 'itemStartDate':
            query = 'SELECT * FROM Items BETWEEN startDate AND startDate <= ? AND isActive = "true" AND isPublished = "true"';
            params = [data.startLowDate, data.startHighDate];
            break;
          case 'itemEndDate':
            query = 'SELECT * FROM Items WHERE endDate >= ? AND endDate <= ? AND isActive = "true" AND isPublished = "true"';
            params = [data.endLowDate, data.endHighDate];
            break;
      }
      pool.query(query,params, (err,rows) => {
        if (err) {
          reject("Database query error: " + err);
  
        } else if ((rows) && (rows.length > 0)) {
          let newRows = []
          for (let i = 0; i < rows.length; i++) {
              if (rows[i].isActive === "true" && rows[i].isPublished === "true") {
                newRows.push(rows[i])
              }
            }
          return resolve(newRows);
        } else {
          return resolve(null); // no items for user
          }
        }
      );
    });
  };
 
  try {

    let status;
    status = await searchItemCustomer(info);
    if (status != 400) {
      console.log(status)
      response.statusCode = 200;
      response.data = status;
      return response;
    }
    else {
      response.statusCode = 400;
      response.error = "search Item failed";
      return response;
    }

  } catch (error) {
    console.log("ERROR: " + error);
    response.statusCode = 400;
    response.error = error;

    return response;
  }

};