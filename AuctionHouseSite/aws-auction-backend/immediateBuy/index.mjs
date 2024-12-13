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
  
  //UPDATED BUYER BALANCE CONSIDERING ALL OTHER BIDS WHERE ITEM IS ACTIVE (AND BUYER IS HIGHEST BID)
  let calculateUpdatedBuyerBalance = (buyerUsername, initialBuyerBalance) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT bids FROM Items WHERE bids IS NOT NULL AND isFulfilled = 'false'",
        (err, results) => {
          if (err) {
            return reject(err); // Database error
          }
  
          let totalHighestBids = 0;
  
          try {
            console.log(results)
            results.forEach((item) => {
              const bids = JSON.parse(item.bids); // Parse the JSON string
  
              if (bids.length > 0) {
                // Find the highest bid
                const highestBid = bids.reduce((max, bid) => {
                  return Number(bid.amount) > Number(max.amount) ? bid : max;
                });
  
                // If the highest bid belongs to the current buyer, add it to the total
                if (highestBid.username === buyerUsername) {
                  totalHighestBids += Number(highestBid.amount);
                }
              }
            });
  
            // Calculate the new buyer balance
            const updatedBuyerBalance = initialBuyerBalance - totalHighestBids;
            resolve(updatedBuyerBalance); // Return the updated balance
          } catch (parseErr) {
            reject(new Error("Failed to parse bids data"));
          }
        }
      );
    });
  };
  
  

  //PLACE THE BID
  let immediatePurchase = (buyerBalance, buyerUsername, itemID) => {
    
    return new Promise((resolve, reject) => {
      // Query to check current item price and isFrozen status
      pool.query(
        "SELECT price, isFrozen FROM Items WHERE id = ?",
        [itemID],
        (err, results) => {
          if (err) {
            reject(err); // Database error
          } else if (results.length === 0) {
            reject(new Error("Item not found"));
          } else {
            const itemPrice = results[0].price || 0; // Handle NULL price as 0
            const isFrozen = results[0].isFrozen;
            let parsedBids;

            //Parse the existing bids, if present
            if(results[0].bids){
              try {
                parsedBids = JSON.parse(results[0].bids);
              } catch (parseErr){
                return reject(new Error("Failed to parse existing bids"));
              }
            } else{
              parsedBids = [];
            }
  
            // Check if item is frozen
            if (isFrozen === "true") {
              reject(new Error("The item is frozen and an immediate purchase cannot ensue"));
              return;
            }
  
            // Check if buyer has enough funds
            if (Number(buyerBalance) < Number(itemPrice)) {
              reject(new Error("Buyer does not have enough funds to place a bid (this includes ALL OTHER ACTIVE BIDS WHERE BUYER IS THE HIGHEST BID"));
              return;
            }

            
            //Append the new bid, but first make sure its not the current highest bid
            if(results[0].bids){
              if(results[0].bids.length > 0){ //if no previous bids, skip to else and push
                const lastBid = parsedBids[parsedBids.length - 1]; //highest bid
                if(lastBid.username === buyerUsername){
                  reject(new Error("You are already the highest bid"))
                } else{
                  parsedBids.push({username: buyerUsername, amount: itemPrice});
                }
              } else{
                parsedBids.push({username: buyerUsername, amount: itemPrice});
              }
            } else{
              parsedBids.push({username: buyerUsername, amount: itemPrice});
            }
            
  
            // Update PRICE IS SET TO THE SAME, BIDS IS UPDATED, AND ITEM BECOMES INACTIVE
            pool.query(
              "UPDATE Items SET price = ?, bids = ?, isActive = ? WHERE id = ?",
              [String(Number(itemPrice)), JSON.stringify(parsedBids), "false",itemID],
              (updateErr, updateResult) => {
                if (updateErr) {
                  reject(updateErr); // Reject on query error
                } else if (updateResult.affectedRows === 0) {
                  reject(new Error("Failed to update item with immediate purchase")); // Ensure item updates
                } else {
                  resolve(200); // Successful immediate purchase
                }
              }
            );
          }
        }
      );
    });
  };
  


 
  try {
    //CALCULATE BUYER BALANCE CONSIDERING ALL OTHER BIDS ON ACTIVE ITEMS (AND WHERE BUYER IS HIGHEST BID)

    const newBuyerBalance = await calculateUpdatedBuyerBalance(info.buyerUsername,info.buyerBalance)
  
    //PURCHASE WITH UPDATED BALANCE
    let status;
    status = await immediatePurchase(newBuyerBalance,info.buyerUsername,info.itemID);
    if (status === 200) {
      response.statusCode = 200;
      response.error = "immediate purchase success " //not actually error, but for messaging purposes

      return response;
    } else {
      response.statusCode = 400;
      response.error = error.message;

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