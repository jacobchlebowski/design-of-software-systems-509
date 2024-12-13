'use client'
import React, { useEffect, useState } from 'react';
import './customer-page.css';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://0sy7wxlvx0.execute-api.us-east-2.amazonaws.com/AuctionHouse'
})


export default function Home() {
    //RENDER

    const [customerItems, setCustomerItems] = useState([]);

    const viewItemCustomer = (e: any) => {
        const username = "customer"
        const data = { username };

        console.log("sending data...")
        console.log(data)
        instance.post("/viewItemCustomer", data).then(function (response) {
            //do something here
            if (400 === response.data.statusCode) {
                alert(response.data.error);
            }
            else if (200 === response.data.statusCode) {
                // alert("items reviewed")
                setCustomerItems(response.data.data);
            }
        }).catch(function (error) {
            alert("Failed")
            //add errors
        })
    }


    //SORT ACTIVE ITEMS CUSTOMER
    const sortItemsCustomer = (sortType: any) => {
        const data = {sortType}
        instance.post('/sortItemsCustomer', data)
        .then(response => {
            if (response.data.statusCode === 200) {
                setCustomerItems(response.data.data);
            } else {
                console.log(response)
                alert(response.data.error)
            }
        })
        .catch(() => alert('Failed to sort items'));
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

    //itemNameSearch
    const handleitemSearch = (InputType : String) => {
        const itemNameInput = (document.querySelector('.itemNameInput') as HTMLInputElement).value;
        const itemDescriptionInput = (document.querySelector('.itemDescriptionInput') as HTMLInputElement).value;
        const itemPriceLowInput = (document.querySelector('.itemPriceLowInput') as HTMLInputElement).value;
        const itemPriceHighInput = (document.querySelector('.itemPriceHighInput') as HTMLInputElement).value;
        const startLowDate = (document.querySelector('.itemStartDateLowInput') as HTMLInputElement).value;
        const startHighDate = (document.querySelector('.itemStartDateHighInput') as HTMLInputElement).value;
        const endLowDate = (document.querySelector('.itemEndDateLowInput') as HTMLInputElement).value;
        const endHighDate = (document.querySelector('.itemEndDateHighInput') as HTMLInputElement).value;

        
        const data = { InputType, itemNameInput, itemDescriptionInput, itemPriceLowInput, itemPriceHighInput, startLowDate,startHighDate,  endLowDate,endHighDate};
        console.log('Hello, World!');
        console.log(data);

        instance.post('/itemSearchCustomer', data).then(response => {
            if (400 === response.data.statusCode) {
                alert(response.data.error);
            } else if (200 === response.data.statusCode) {
                setCustomerItems(response.data.data);
            }
        }).catch(function (error) {
            alert("Failed");
        });
    }
    

    return (
        <main className="customerMain">
            <div id="customerUsername" className="customerUsername">
                {"customer"}
            </div>

            <div className="searchBoxes">
                <div className="itemNameSearchBox">
                    <label>Item name: </label>
                    <input className="itemNameInput" type="text" placeholder="item name"></input>
                    <button className="itemNameSearchButton" onClick={() => handleitemSearch("itemName")}>Search</button>
                </div>

                <div className="itemDescriptionSearchBox">
                    <label>Item description: </label>
                    <input className="itemDescriptionInput" type="text" placeholder="item description"></input>
                    <button className="itemDescriptionSearchButton"onClick={() => handleitemSearch("itemDescription")}>Search</button>
                </div>

                <div className="itemPriceSearchBox">
                    <label>Item price: </label>
                    <input className="itemPriceLowInput" type="text" placeholder="low price range"></input>
                    <input className="itemPriceHighInput" type="text" placeholder="high price range"></input>
                    <button className="itemPriceSearchButton"onClick={() => handleitemSearch("itemPrice")}>Search</button>
                </div>

            

                <div className="itemStartDateSearchBox">
                    <label>Item start date range: </label>
                    <input className="itemStartDateLowInput" type="date" placeholder="item start date low"></input>
                    <input className="itemStartDateHighInput" type="date" placeholder="item start date high"></input>
                    <button className="itemDateSearchButton"onClick={() => handleitemSearch("itemStartDate")}>Search</button>
                </div>

                <div className="itemEndDateSearchBox">
                    <label>Item end date range: </label>
                    <input className="itemEndDateLowInput" type="date" placeholder="item end date low"></input>
                    <input className="itemEndDateHighInput" type="date" placeholder="item end date high"></input>
                    <button className="itemEndSearchButton"onClick={() => handleitemSearch("itemEndDate")}>Search</button>
                </div>
            </div>



            <div className="customerItems">
                <button className="reviewItems" onClick={(e) => viewItemCustomer(e)}>{"View Items"}</button>
                <label>Items: </label>

            </div>

            <div className="itemTable">
                {customerItems && customerItems.length > 0 ? (
                    <table className="items">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Item Price</th>
                                <th>Item Description</th>
                                <th>Item Image</th>
                                <th>Highest Bid/Bidder</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {customerItems.map((item, index) => (
                            <React.Fragment key={item.id || index}>
                                <tr>
                                    <td>{item.itemName}</td>
                                    <td>{item.price}</td>
                                    <td>{item.description}</td>
                                    <td><img className="itemImage" src={item.imageUrl} alt={item.itemName} /></td>
                                    <td>{getHighestBidder(item.bids)}</td>
                                    <td>{item.startDate}</td>
                                    <td>{item.endDate}</td>
                                </tr>
                                <tr>
                                    <td colSpan={7}>
                                        <label>__</label>
                                    </td>
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
                <label className="sortLabel">Sort Active Items</label>
                <button className="sortingButton" onClick={() => {sortItemsCustomer("Name"); }}> Name </button>
                <button className="sortingButton" onClick={() => {sortItemsCustomer("Price"); }}> Price </button>
                <button className="sortingButton" onClick={() => {sortItemsCustomer("Start Date"); }}> Start Date</button>
                <button className="sortingButton" onClick={() => {sortItemsCustomer("End Date"); }}> End Date</button>
            </div>


        </main >
    );
}