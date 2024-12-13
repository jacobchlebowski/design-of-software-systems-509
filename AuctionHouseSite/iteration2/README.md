# Iteration 2 Use Cases

## Set Up & App Quirks
- Use URL: [https://auctionhouse24.s3.us-east-2.amazonaws.com/login-page.html](https://auctionhouse24.s3.us-east-2.amazonaws.com/login-page.html)
- Register both a **seller** and **buyer** account
- Admin is already registered
- When registered, login on 3 seperate tabs (one for seller, buyer, and admin) where admin username="admin" and password="password"
- If unable to access seller page use URL: [https://auctionhouse24.s3.us-east-2.amazonaws.com/seller-page.html?username=USERNAME] where **USERNAME** is your account username
- If unable to access buyer page use URL:  [https://auctionhouse24.s3.us-east-2.amazonaws.com/buyer-page.html?username=USERNAME] where **USERNAME** is your account username
- If unable to access admin page use URL: [http://auctionhouse24.s3-website.us-east-2.amazonaws.com/admin-page.html]
- Sometimes on the buyer/seller pages, it's necessary to click **view, sorting, or search** buttons twice since an error will occur if they are clicked too fast (this is a work in progress). The functions still work as intended.

- Sometimes on the buyer page, it is necessary to click "view items" or a sort multiple times to view those items. This is a work in progress

## Publish Item (Seller)
- Add an item with a future end date
- Click **Review Items** to see unpublished items
- Click **Publish Item** to publish your added item
- Failure to publish item will result in an alert
- Item gains a start date and becomes active

## Unpublish Item (Seller)
- From previous step, click **Unpublish Item** to unpublish the published item
- Item becomes inactive, and ability to remove item is available
- If a bid is already placed on the item, the webpage will prompt an alert and the item can therefore not become unpublished. This can be tested later on after **Use Case: Place Bid (Buyer)** is performed

## Add Funds (Buyer)
- Navigate to the buyer page
- Enter a value to add to balance and click **Add funds**
- Attempting to add funds that is not a whole number and at least 1 will prompt a failure alert
- A successful attempt to add funds will result in the buyers balance increasing by that much

## View Item (Buyer)
- Click **View Items** to view the sellers published and active items which includes item details
- If there are no published and active items, there will be no items to display

## Place Bid (Buyer)
- Type in a bid that is at least the "Item Price" value
- Click **Place Bid**
- If successful, a prompt with an alert will appear, bidding history will update, and highest bid/bidder will update
- A failed bid means either: the item is frozen, you are already the highest bid, your bid is less than the current price, you are exceeding your funds with open unfulfilled bids (where you are the already the highest bid) and an error alert will appear depending on the failure

## Review Active Bids (Buyer)
- Click **Review My Active Bids** to view all items which you have a bid placed
- If you have no bids placed, there will be no items to display

## Freeze Item (Admin)
- Navigate to the admin page
- Click **Populate Items** to view all active items that are up for bidding
- Click **Freeze Item** under the item you wish to freeze
- Upon success, an alert will appear, and no bids can be placed on the item

## Request Unfreeze Item (Seller)
- Navigate to the seller page
- Click **Review Items** and upon success, notice the frozen item can be requested to be unfrozen
- Click **Request Unfreeze** and upon success, an alert will appear for requesting to unfreeze an item

## Unfreeze Item (Admin)
- Navigate to the admin page
- Click **Populate Items**
- Notice items that are frozen, unfrozen, and ones where the seller has requested to unfreeze the item
- Click **Unfreeze Item**
- Upon success an alert will appear and the request to unfreeze an item will be voided

## Immediate Buy (Buyer and Seller)
- Navigate to the seller page
- Add an item with a future end date and select the **Buy now?** option
- Publish that item
- Navigate to the buyer page
- View items on buyer page
- Click **Buy Now** for the item that has an immediate buy option
- Upon success, an alert will appear and the item becomes inactive (still published), and will disappear from the buyer page, ready for fulfillment
- Failure alerts will appear if the buyer does not have enough funds (including all other bids (highest bid) and purchases), or if the item is frozen

