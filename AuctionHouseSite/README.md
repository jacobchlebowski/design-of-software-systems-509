# Auction House Application
http://auctionhouse24.s3-website.us-east-2.amazonaws.com/

## Team RUST

## Authors and acknowledgement
Jacob Chlebowski - jachlebowski@wpi.edu<br>
Zaq Humphrey - zihumphrey@wpi.edu<br>
Matthew Giorgio - msgiorgio@wpi.edu<br>
Samuel Veilleux - seveilleux@wpi.edu<br>

This project contains source code and supporting files for an AuctionSite application. Back and front-end development found in respective source folders.

## Description
AuctionSite is an application created by Jacob, Zaq, Matthew, and Samuel in which bids and auctions take place. There are sellers, buyers, a customer, and an administrator. The flow of events is as follows: An account is created for a buyer or a seller. Upon login, the seller can upload items to publish for buyers to place bids. On the buyer page, they can increase their available funds to either immediately purchase or bid on an item before the end date arrives. The buyer can view other bids on the item and also if they've won the item. Filters can also be applied for the buyer and customer to view items that are for sale, only the customer cannot place bids. The admin has the ability to freeze/unfreeze published items, and can generate both an auction and forensic report.

## Use Cases Defined:

* createAccountSeller
* closeAccountSeller
* loginAccountSeller
* addItemSeller
* removeInactiveItemSeller
* editItemSeller
* publishItemSeller
* reviewItemsSeller
* fulfillItemSeller
* unpublishItemSeller
* archiveItemSeller
* requestUnfreezeItemSeller
* searchItemsCustomer
* sortItemsCustomer
* viewItemCustomer
* openAccountBuyer
* closeAccountBuyer
* loginAccountBuyer
* addFundsBuyer
* searchRecentlySoldBuyer
* sortRecentlySoldBuyer
* viewItemBuyer
* placeBidBuyer
* reviewActiveBidsBuyer
* reviewPurchaesBuyer
* **immediateBuy** (added in late)
* freezeItemAdmin
* unfreezeItemAdmin
* generateAuctionReportAdmin
* generateForensicsReportAdmin

<br>

### COMMENTS/QUIRKS
- Sometimes it may take multiple attempts to sort/review items, but they won't fail

### Admin login credentials:<br>
<b>username: admin<br>
password: password <b>

#### License
MIT License
