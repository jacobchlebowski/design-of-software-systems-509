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
  
  //UPDATED BUYER BALANCE CONSIDERING ALL OTHER BIDS WHERE ITEM IS ACTIVE
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
            
            console.log("BEFROEEEEEEEEEEEE")
            // Calculate the new buyer balance
            const updatedBuyerBalance = initialBuyerBalance - totalHighestBids;
            console.log("HELLLLLLLLO")
            console.log(updatedBuyerBalance)
            resolve(updatedBuyerBalance); // Return the updated balance
          } catch (parseErr) {
            reject(new Error("Failed to parse bids data"));
          }
        }
      );
    });
  };
  
  

  //PLACE THE BID
  let placeBidBuyer = (buyerBalance, buyerUsername, itemID, dollarAmountBid) => {
    console.log(`Placing bid: ${dollarAmountBid} on item: ${itemID} by ${buyerUsername}`);
    
    return new Promise((resolve, reject) => {
      // Query to check current item price and isFrozen status
      pool.query(
        "SELECT price, isFrozen, bids FROM Items WHERE id = ?",
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
              reject(new Error("The item is frozen and a bid cannot be placed"));
              return;
            }
  
            // Check if buyer has enough funds
            if (Number(buyerBalance) < Number(itemPrice)) {
              reject(new Error("Buyer does not have enough funds to place a bid (this includes ALL OTHER ACTIVE BIDS WHERE BUYER IS THE HIGHEST BID"));
              return;
            }

            //Check to make sure the dollarAmountBid is greater than the current price
            if (Number(dollarAmountBid) < Number(itemPrice)){
              reject(new Error("Buyer must place bid at current price or greater"));
              return;
            }

            // Check to make sure the dollarBidAmount is NOT greater than the buyerBalance (if it is, then error)
            if (Number(dollarAmountBid) > Number(buyerBalance)){
              reject(new Error("Must bid within your balance range"))
              return;
            }
            //Append the new bid, but first make sure its not the current highest bid
            if(results[0].bids){
              if(results[0].bids.length > 0){ //if no previous bids, skip to else and push
                const lastBid = parsedBids[parsedBids.length - 1]; //highest bid
                if(lastBid.username === buyerUsername){
                  reject(new Error("You are already the highest bid"))
                } else{
                  parsedBids.push({username: buyerUsername, amount: dollarAmountBid});
                }
              } else{
                parsedBids.push({username: buyerUsername, amount: dollarAmountBid});
              }
            } else{
              parsedBids.push({username: buyerUsername, amount: dollarAmountBid});
            }
  
            // Update the item with the new bid and BID ARRAY
            pool.query(
              "UPDATE Items SET price = ?, bids = ? WHERE id = ?",
              [String(Number(dollarAmountBid)+1), JSON.stringify(parsedBids), itemID],
              (updateErr, updateResult) => {
                if (updateErr) {
                  reject(updateErr); // Reject on query error
                } else if (updateResult.affectedRows === 0) {
                  reject(new Error("Failed to update item with bid")); // Ensure item updates
                } else {
                  resolve(200); // Successfully placed bid
                }
              }
            );
          }
        }
      );
    });
  };
  


 
  try {
    //CALCULATE BUYER BALANCE CONSIDERING ALL OTHER BIDS ON ACTIVE ITEMS

    const newBuyerBalance = await calculateUpdatedBuyerBalance(info.buyerUsername,info.buyerBalance)
    console.log(`Updated buyer balance: ${newBuyerBalance}`);
  
    //PLACE THE BID WITH UPDATED BALANCE
    let status;
    status = await placeBidBuyer(newBuyerBalance,info.buyerUsername,info.itemID,info.dollarAmountBid);
    if (status === 200) {
      response.statusCode = 200;
      response.error = "placeBidBuyer success" //not actually error, but for messaging purposes

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