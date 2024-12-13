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

  // SORT RECENTLY SOLD BUYER NAME
  let sortRecentlySoldBuyerName = () => {
    return new Promise((resolve, reject) => {
      // Use SQL to filter and sort
      let currentDate = formatDateToEasternTime(new Date());
      pool.query(
        "SELECT * FROM Items WHERE bids IS NOT NULL ORDER BY itemName ASC", // Corrected SQL query
        (err, rows) => {
          if (err) {
            return reject(err); // Handle error properly
          }
          if (rows && rows.length > 0) {
            let newRows = [];
            for (let i = 0; i < rows.length; i++) {
              let endDate = rows[i].endDate
              let twentyFourHoursAfter1 = new Date(endDate); // Clone endDate
              twentyFourHoursAfter1.setHours(twentyFourHoursAfter1.getHours() + 24);
              let twentyFourHoursAfter = twentyFourHoursAfter1.toISOString().slice(0, 16);

              // Check if currentDate is between endDate and 24 hours after endDate
              if (rows[i].bids && (endDate < currentDate) && (currentDate < twentyFourHoursAfter)) {
                newRows.push(rows[i]);
              }
            }
            return resolve(newRows); // Return filtered rows, not the original rows
          } else {
            return resolve(null); // No items found
          }
        }
      );
    });
  };

  //SORT RECENTLY SOLD BUYER PRICE
   let sortRecentlySoldBuyerPrice = () => {
    return new Promise((resolve, reject) => {
      // Use SQL to filter and sort
      let currentDate = formatDateToEasternTime(new Date());
      pool.query(
        "SELECT * FROM Items WHERE bids IS NOT NULL ORDER BY price ASC", // Corrected SQL query
        (err, rows) => {
          if (err) {
            return reject(err); // Handle error properly
          }
          if (rows && rows.length > 0) {
            let newRows = [];
            for (let i = 0; i < rows.length; i++) {
              let endDate = rows[i].endDate
              let twentyFourHoursAfter1 = new Date(endDate); // Clone endDate
              twentyFourHoursAfter1.setHours(twentyFourHoursAfter1.getHours() + 24);
              let twentyFourHoursAfter = twentyFourHoursAfter1.toISOString().slice(0, 16);

              // Check if currentDate is between endDate and 24 hours after endDate
              if (rows[i].bids && (endDate < currentDate) && (currentDate < twentyFourHoursAfter)) {
                newRows.push(rows[i]);
              }
            }
            return resolve(newRows); // Return filtered rows, not the original rows
          } else {
            return resolve(null); // No items found
          }
        }
      );
    });
  };

    // SORT RECENTLY SOLD BUYER START DATE
    let sortRecentlySoldBuyerStartDate = () => {
      return new Promise((resolve, reject) => {
        // Use SQL to filter and sort
        let currentDate = formatDateToEasternTime(new Date());
        pool.query(
          "SELECT * FROM Items WHERE bids IS NOT NULL ORDER BY startDate ASC", // Corrected SQL query
          (err, rows) => {
            if (err) {
              return reject(err); // Handle error properly
            }
            if (rows && rows.length > 0) {
              let newRows = [];
              for (let i = 0; i < rows.length; i++) {
                let endDate = rows[i].endDate
                let twentyFourHoursAfter1 = new Date(endDate); // Clone endDate
                twentyFourHoursAfter1.setHours(twentyFourHoursAfter1.getHours() + 24);
                let twentyFourHoursAfter = twentyFourHoursAfter1.toISOString().slice(0, 16);
  
                // Check if currentDate is between endDate and 24 hours after endDate
                if (rows[i].bids && (endDate < currentDate) && (currentDate < twentyFourHoursAfter)) {
                  newRows.push(rows[i]);
                }
              }
              return resolve(newRows); // Return filtered rows, not the original rows
            } else {
              return resolve(null); // No items found
            }
          }
        );
      });
    };

 // SORT RECENTLY SOLD BUYER END DATE
 let sortRecentlySoldBuyerEndDate = () => {
  return new Promise((resolve, reject) => {
    // Use SQL to filter and sort
    let currentDate = formatDateToEasternTime(new Date());
    pool.query(
      "SELECT * FROM Items WHERE bids IS NOT NULL ORDER BY endDate ASC", // Corrected SQL query
      (err, rows) => {
        if (err) {
          return reject(err); // Handle error properly
        }
        if (rows && rows.length > 0) {
          let newRows = [];
          for (let i = 0; i < rows.length; i++) {
            let endDate = rows[i].endDate
            let twentyFourHoursAfter1 = new Date(endDate); // Clone endDate
            twentyFourHoursAfter1.setHours(twentyFourHoursAfter1.getHours() + 24);
            let twentyFourHoursAfter = twentyFourHoursAfter1.toISOString().slice(0, 16);

            // Check if currentDate is between endDate and 24 hours after endDate
            if (rows[i].bids && (endDate < currentDate) && (currentDate < twentyFourHoursAfter)) {
              newRows.push(rows[i]);
            }
          }
          return resolve(newRows); // Return filtered rows, not the original rows
        } else {
          return resolve(null); // No items found
        }
      }
    );
  });
};



  let setInactive = () => {
    return new Promise((resolve, reject) => {
      const currentDate = formatDateToEasternTime(new Date())
      pool.query("SELECT * FROM Items", (err, rows) => { // Get all items
        if (err) {
          return reject(err); // Handle query error
        }
        if (rows && rows.length > 0) {
          let updates = [];
          for (let i = 0; i < rows.length; i++) {
            let endDate = new rows[i].endDate
            if (currentDate >= endDate) {
              // Perform SQL update query for the row
              updates.push(
                new Promise((resolve, reject) => {
                  pool.query(
                    "UPDATE Items SET isActive = ? WHERE id = ?",
                    ["false", rows[i].id], // Update isActive to false for the matching id
                    (updateErr) => {
                      if (updateErr) return reject(updateErr);
                      resolve();
                    }
                  );
                })
              );
            }
          }
          // Ensure all updates are completed
          Promise.all(updates)
            .then(() => resolve(200)) // All updates successful
            .catch((updateErr) => reject(updateErr));
        } else {
          resolve(400); // No items found
        }
      });
    });
  };


  try {

    let status;
    setInactive(); // sets items that are past end date to be inactive

    //SORT BY NAME
    if(info.sortType === "Name"){
      status = await sortRecentlySoldBuyerName();
      if (status != 400) {
        console.log(status)
        response.statusCode = 200;
        response.data = status;
        return response;
      }
      else {
        response.statusCode = 400;
        response.error = "we messed up";

        return response;
      }
    }
    
    //SORT BY PRICE
    if(info.sortType === "Price"){
      status = await sortRecentlySoldBuyerPrice();
      if (status != 400) {
        console.log(status)
        response.statusCode = 200;
        response.data = status;
        return response;
      }
      else {
        response.statusCode = 400;
        response.error = "we messed up";

        return response;
      }
    }

    // //SORT BY START DATE
    if(info.sortType === "Start Date"){
      status = await sortRecentlySoldBuyerStartDate();
      if (status != 400) {
        console.log(status)
        response.statusCode = 200;
        response.data = status;
        return response;
      }
      else {
        response.statusCode = 400;
        response.error = "we messed up";

        return response;
      }
    }
    
    // //SORT BY END DATE
    if(info.sortType === "End Date"){
      status = await sortRecentlySoldBuyerEndDate();
      if (status != 400) {
        console.log(status)
        response.statusCode = 200;
        response.data = status;
        return response;
      }
      else {
        response.statusCode = 400;
        response.error = "we messed up";

        return response;
      }
    }


    

  } catch (error) {
    console.log("ERROR: " + error);
    response.statusCode = 400;
    response.error = error.message;

    return response;
  }

};