'use client'
import React, { useEffect, useState } from 'react';
import './buyer-page.css';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://0sy7wxlvx0.execute-api.us-east-2.amazonaws.com/AuctionHouse'
})


export default function Home() {
    //RENDER

    //GRAB BUYERUSERNAME FROM URL
    const [buyerItems, setBuyerItems] = useState([]);
    const [username, setBuyerUsername] = useState<string>("");
    const [balance, setBalance] = useState<string>("");

    const [lastClickedButton, setLastClickedButton] = useState<string>('');

    const handleButtonClick = (buttonLabel: string) => {
        setLastClickedButton(buttonLabel);
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get("username");
        if (username) {
            setBuyerUsername(username);
        }
    }, []);


    const getBalance = (e: any) => {
        const username = (document.getElementById("buyerUsername")).innerText;

        let data = { username };

        console.log("Sending data:", data);
        instance.post("/getBalance", data).then(function (response) {
            //do something here
            if (400 === response.data.statusCode) {
                alert(response.data.error);
            }
            else if (200 === response.data.statusCode) {
                // alert("got balance")
                setBalance(response.data.value);
            }
        }).catch(function (error) {
            alert("Failed")
            //add errors
        })
    }

    //REVIEW ACTIVE PURCHASES BUYER
    const reviewPurchasesBuyer = (username: any) => {
        const data = {username}
        instance.post('/reviewPurchasesBuyer', data)
        .then(response => {
            if (response.data.statusCode === 200) {
            setBuyerItems(response.data.data);
            } else {
                console.log(response)
                alert(response.data.errorMessage)
            }
        })
        .catch(() => alert('Failed to review purchases'));
    }

    //REVIEW ACTIVE BIDS BUYER
    const reviewActiveBidsBuyer = (username: any) => {
        const data = {username}
        instance.post('/reviewActiveBidsBuyer', data)
        .then(response => {
            if (response.data.statusCode === 200) {
            setBuyerItems(response.data.data);
            } else {
                console.log(response)
                alert(response.data.errorMessage)
            }
        })
        .catch(() => alert('Failed to review active bids'));
    }


    //SEARCH RECENTLY SOLD BUYER
    const searchRecentlySoldBuyer = (username: any) => {
        const data = {username}
        instance.post('/searchRecentlySoldBuyer', data)
        .then(response => {
            if (response.data.statusCode === 200) {
            setBuyerItems(response.data.data);
            } else {
                console.log(response)
                alert(response.data.errorMessage)
            }
        })
        .catch(() => alert('Failed to search recently sold items'));
    }

     //SORT RECENTLY SOLD BUYER
     const sortRecentlySoldBuyer = (sortType: any) => {
        const data = {sortType}
        instance.post('/sortRecentlySoldBuyer', data)
        .then(response => {
            if (response.data.statusCode === 200) {
            setBuyerItems(response.data.data);
            } else {
                console.log(response)
                alert(response.data.error)
            }
        })
        .catch(() => alert('Failed to sort recently sold items'));
    }


    //HANDLE placeBidBuyer
    const handlePlaceBid = (itemID: any) => {
        const buyerBalance = parseFloat((document.getElementById("buyerBalance") as HTMLElement).innerText.replace('$', ''));
        const buyerUsername = username;
        const escapedID = CSS.escape(itemID);
        const dollarAmountBid = (document.querySelector(`#${escapedID}`) as HTMLInputElement).value;

        if (Number(dollarAmountBid) < 1 || !Number.isInteger(Number(dollarAmountBid))) {
            return alert("Must enter a WHOLE number that is AT LEAST 1")
        }

        const data = { itemID, buyerBalance, buyerUsername, dollarAmountBid };
        instance.post('/placeBidBuyer', data)
        .then(response => {
            if (response.data.statusCode === 200) {
            alert('Bid successfully placed');
            buyerViewItem("");
            } else {
                console.log(response)
                alert(response.data.error)
            // alert("bid must be at least same as price, buyer must have sufficient funds, item must not be frozen");
            }
        })
        .catch(() => alert('Failed to bid on item.'));
    };


     //HANDLE buyNow
     const handleBuyNow = (itemID: any) => {
        const buyerBalance = parseFloat((document.getElementById("buyerBalance") as HTMLElement).innerText.replace('$', ''));
        const buyerUsername = username;
        const data = { itemID, buyerBalance, buyerUsername };
        instance.post('/immediateBuy', data)
        .then(response => {
            if (response.data.statusCode === 200) {
            alert(response.data.error);
            buyerViewItem("");
            } else {
                alert(response.data.error)
            }
        })
        .catch(() => alert('Failed immediate purchase'));
    };

    // Fetch balance when username is set
    useEffect(() => {
        if (username) {
            getBalance(username);
        }
    }, [username]);

    const buyerViewItem = (e: any) => {
        const username = (document.getElementById("buyerUsername")).innerText;
        const data = { username };

        console.log("sending data...")
        console.log(data)
        instance.post("/buyerViewItem", data).then(function (response) {
            //do something here
            if (400 === response.data.statusCode) {
                alert(response.data.error);
            }
            else if (200 === response.data.statusCode) {
                // alert("items reviewed")
                setBuyerItems(response.data.data);
            }
        }).catch(function (error) {
            alert("Failed")
            //add errors
        })
    }

    const closeBuyerAccount = (e: any) => {
        const buyerUsername = (document.getElementById("buyerUsername")).innerText;

        let data = { buyerUsername };

        console.log("Sending data:", data);
        instance.post("/closeAccountBuyer", data).then(function (response) {
            //do something here
            if (400 === response.data.statusCode) {
                alert(response.data.error);
            }
            else if (200 === response.data.statusCode) {
                alert("Account successfully closed")
                // window.location.href = 'http://localhost:3000/login-page';
                window.location.href = `https://auctionhouse24.s3.us-east-2.amazonaws.com/login-page.html`;
            }
        }).catch(function (error) {
            alert("Failed")
            //add errors
        })
    }

    const addFunds = (e: any) => {
        const username = (document.getElementById("buyerUsername")).innerText;
        const funds = (document.querySelector('.addFunds') as HTMLInputElement).value;

        if (Number(funds) < 1 || !Number.isInteger(Number(funds))) {
            return alert("Must enter a WHOLE number that is AT LEAST 1")
        }

        let data = { username, funds };

        console.log("Sending data:", data);
        instance.post("/addFunds", data).then(function (response) {
            //do something here
            if (400 === response.data.statusCode) {
                alert(response.data.error);
            }
            else if (200 === response.data.statusCode) {
                alert("added funds")
                getBalance(username)
            }
        }).catch(function (error) {
            alert("Failed")
            //add errors
        })
    }

    const getHighestBidder = (bids: any) => {
        if (!bids) {
            return ""; // Handle null or undefined bids
        }
        try {
            bids = JSON.parse(bids);
    
            if (!Array.isArray(bids) || bids.length === 0) {
                return ""; // Handle non-array or empty array cases
            }
    
            const highestBid = bids.reduce((max: { amount: number }, bid: { amount: number }) => {
                return Number(bid.amount) > Number(max.amount) ? bid : max;
            });
            return highestBid.username || ""; // Ensure username is returned or an empty string
        } catch (error) {
            return ""; // Handle JSON parsing errors
        }
    };

    return (
        <main className="buyerMain">
            <div id="buyerUsername" className="buyerUsername">
                {username}
            </div>

            <div id="buyerBalance" className="buyerBalance">
                {balance !== null ? `$${balance}` : "Loading balance..."}
            </div>

            <div className="addBalance">
                <label>Add to Balance: </label>
                <button onClick={(e) => addFunds(e)}>Add funds</button>
                <input className="addFunds" type="text" placeholder="$"></input>
            </div>


            <div className="buyerItems">
                <button className="reviewItems" onClick={(e) => {buyerViewItem(e); handleButtonClick('View Items');}}>{"View Items"}</button>
                <label>Items: </label>

            </div>

            <div className="itemTable">
                {buyerItems && buyerItems.length > 0 ? (
                    <table className="items">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Item Price</th>
                                <th>Item Description</th>
                                <th>Item Image</th>
                                <th>Highest Bid/Bidder</th>
                                <th>Place Bid</th>
                                <th>Bidding History</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buyerItems.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr>
                                        <td>{item.itemName}</td>
                                        <td>{item.price}</td>
                                        <td>{item.description}</td>
                                        <td><img className="itemImage" src={item.imageUrl} /></td>
                                        <td>{getHighestBidder(item.bids)}</td>
                                        <td>
                                            <button className="placeBid" disabled={(item.buyNow === "true") || (lastClickedButton !== "View Items")} onClick={() => handlePlaceBid(item.id)}>Place Bid</button>
                                            <input disabled={(item.buyNow === "true") || (lastClickedButton !== "View Items")} id={item.id} className="placeBidInput" type="text" placeholder="$" />
                                            <button className="buyNow" disabled={(item.buyNow === "false") || (lastClickedButton !== "View Items")} onClick={() => handleBuyNow(item.id)}>Buy Now</button>
                                        </td>
                                        <td>
                                            <table className="biddingHistory">
                                                <tbody>
                                                    <tr>
                                                        <td>{item.bids}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td>{item.startDate}</td>
                                        <td>{item.endDate}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={9}><label>__</label></td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>

                    </table>
                ) : (
                    <p>No items to display</p>
                )}
            </div>


            <div className="sorting">
                <button className="sortingButton" onClick={() => {searchRecentlySoldBuyer(username); handleButtonClick('Search Recently Sold');}}>{"Search Recently Sold (24 Hrs)"}</button>
                <button className="sortingButton" onClick={() => {reviewActiveBidsBuyer(username); handleButtonClick('Review My Active Bids');}}>Review My Active Bids</button>
                <button className="sortingButton" onClick={() => {handleButtonClick('Review Purchases'); reviewPurchasesBuyer(username); }}>Review Purchases</button>
                <label className="sortLabel">{"Sort Recently Sold (24 Hrs)"}</label>
                <button className="sortingButton" onClick={() => {handleButtonClick('Name'); sortRecentlySoldBuyer("Name"); }}> Name </button>
                <button className="sortingButton" onClick={() => {handleButtonClick('Price'); sortRecentlySoldBuyer("Price");}}> Price </button>
                <button className="sortingButton" onClick={() => {handleButtonClick('Start Date'); sortRecentlySoldBuyer("Start Date");}}> Start Date </button>
                <button className="sortingButton" onClick={() => {handleButtonClick('End Date'); sortRecentlySoldBuyer("End Date");}}> End Date </button>
            </div>

            <div className="closeAccount">
                <button className="closeAccountButton" onClick={(e) => closeBuyerAccount(e)}>Close Account</button>
            </div>


        </main >
    );
}