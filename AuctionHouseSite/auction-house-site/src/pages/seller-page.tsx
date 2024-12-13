'use client';
import React, { useEffect, useState } from 'react';
import './seller-page.css';
import axios from 'axios';
import { read } from 'fs';

const instance = axios.create({
  baseURL: 'https://0sy7wxlvx0.execute-api.us-east-2.amazonaws.com/AuctionHouse'
});



export default function SellerPage() {
  const [balance, setBalance] = useState<string>("");
  const [sellerItems, setSellerItems] = useState([]);
  const [username, setSellerUsername] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");

  //GET OVERALL STATUS AN ITEM
  const getOverallStatus = (item:any) => {
    //if item is completed with bids (AKA published, inactive, with bids), status is "completed - awaiting fulfillment"
    //else if item is fulfilled, it becomes archived in another backend function, and the status is "archived"
    //else if item is completed with NO bids (AKA published,inactive, NO BIDS). it cannot be fulfilled and the status is "failed". No buttons can be clicked when it's failed
    if (item.isPublished==="true" && item.isActive==="false" && item.bids!==null && item.isArchived==="false"){
      return "completed, awaiting fulfillment"
    } else if (item.isArchived === "true"){
      return "archived"
    } else if (item.isPublished==="true" && item.isActive==="false" && item.bids===null){
      return "failed"
    } else{
      return " "
    }
  }

  //GRAB SELLER USERNAME FROM URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    if (username) {
      setSellerUsername(username);
    }
  }, []);

  const getBalance = (e: any) => {
    const username = (document.getElementById("sellerUsername")).innerText;

    let data = { username };

    console.log("Sending data:", data);
    instance.post("/getBalance", data).then(function (response) {
      //do something here
      if (400 === response.data.statusCode) {
        alert(response.data.error);
      }
      else if (200 === response.data.statusCode) {
        // alert("got balance")
        console.log(response.data.balance)
        setBalance(response.data.value);
      }
    }).catch(function (error) {
      alert("Failed")
      //add errors
    })
  }

  // Fetch balance when username is set
  useEffect(() => {
    if (username) {
      getBalance(username);
    }
  }, [username]);

  //CONVERT IMAGE FILE TO BASE64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setBase64: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setBase64(reader.result.toString());
        }
      };
      reader.readAsDataURL(file); //converts the file to base64
    }
  };


  //handleAddItem
  const handleAddItem = () => {
    const itemName = (document.querySelector('.addItem-itemNameInput') as HTMLInputElement).value;
    const description = (document.querySelector('.addItem-descriptionInput') as HTMLInputElement).value;
    const price = (document.querySelector('.addItem-initialPriceInput') as HTMLInputElement).value;
    const endDate = (document.querySelector('.addItem-endDateInput') as HTMLInputElement).value;
    const buyNow = document.querySelector('.addItem-buyNow').checked ? "true" : "false";
    let imageUrl = imageBase64;

    //check to make sure all required fields are filled
    if (!itemName || !imageUrl || !description || !price || !endDate) {
      alert("Please fill in all required fields (Image, Item Name, Description, Initial Price, End Date).");
      return;
    }

    let startDate;
    const sellerUsername = document.getElementById('sellerUsername')?.innerText;

    const data = { itemName, imageUrl, description, price, startDate, endDate, sellerUsername, buyNow };
    instance.post('/addItemSeller', data)
      .then(response => {
        if (response.data.statusCode === 200) {
          alert('Item successfully added');
          reviewItems("");
        } else {
          alert(response.data.error);
        }
      })
      .catch(() => alert('Failed to add item.'));
  };

  //handleRemoveItem
  const handleRemoveItem = (itemId: any) => {
    const data = { itemId }
    instance.post('/removeInactiveItemSeller', data)
      .then(response => {
        if (response.data.statusCode === 200) {
          alert('Inactive item successfully removed');
          reviewItems("");
        } else {
          alert(response.data.error);
        }
      })
      .catch(() => alert('Failed to remove inactive item.'));
  };

  //handleEditItem
  const handleEditItem = () => {
    const itemID = (document.querySelector('.editItem-itemID') as HTMLInputElement).value;
    const itemName = (document.querySelector('.editItem-itemNameInput') as HTMLInputElement).value;
    const description = (document.querySelector('.editItem-descriptionInput') as HTMLInputElement).value;
    const price = (document.querySelector('.editItem-initialPriceInput') as HTMLInputElement).value;
    const endDate = (document.querySelector('.editItem-endDateInput') as HTMLInputElement).value;
    const buyNow = document.querySelector('.editItem-buyNow').checked ? "true" : "false";
    let imageUrl = imageBase64;

    //check to make sure all required fields are filled
    if (!itemName || !imageUrl || !description || !price || !endDate) {
      alert("Please fill in all required fields (Image, Item Name, Description, Initial Price, End Date).");
      return;
    }

    let startDate;
    const sellerUsername = document.getElementById('sellerUsername')?.innerText;

    const data = { itemID, imageUrl, itemName, description, price, startDate, endDate, sellerUsername, buyNow };
    instance.post('/editItemSeller', data)
      .then(response => {
        if (response.data.statusCode === 200) {
          alert('Item successfully edited');
          reviewItems("");
        } else {
          alert(response.data.error);
        }
      })
      .catch(() => alert('Failed to edit item.'));
  };


  //handlePublishItem
  const handlePublishItem = (itemID: any) => {
    const data = { itemID };
    instance.post('/publishItemSeller', data)
      .then(response => {
        if (response.data.statusCode === 200) {
          alert('Item successfully published');
          reviewItems("");
        } else {
          alert(response.data.error);
        }
      })
      .catch(() => alert('Failed to publish item.'));
  };

  //handleUnPublishItem
  const handleUnPublishItem = (itemID: any) => {
    const data = { itemID };
    instance.post('/unpublishItemSeller', data)
      .then(response => {
        if (response.data.statusCode === 200) {
          alert('Item successfully unpublished');
          reviewItems("");
        } else {
          alert(response.data.error);
        }
      })
      .catch(() => alert('Failed to unpublish item.'));
  };

  //handle Request unfreeze item seller
  const handleRequestUnfreezeItemSeller = (itemID: any) => {
    const data = { itemID };
    instance.post('/requestUnfreezeItemSeller', data)
      .then(response => {
        if (response.data.statusCode === 200) {
          alert('Successfully requested to unfreeze item');
          reviewItems("");
        } else {
          alert(response.data.error);
        }
      })
      .catch(() => alert('Failed to request to unfreeze item.'));
  };

  const closeSellerAccount = (e: any) => {
    const sellerUsername = (document.getElementById("sellerUsername")).innerText;

    let data = { sellerUsername };

    console.log("Sending data:", data);
    instance.post("/closeAccountSeller", data).then(function (response) {
      //do something here
      if (400 === response.data.statusCode) {
        alert(response.data.error);
      }
      else if (200 === response.data.statusCode) {
        // alert(response.data.error);
        alert("Account successfully closed")
        //window.location.href = 'http://localhost:3000/login-page';
        window.location.href = `https://auctionhouse24.s3.us-east-2.amazonaws.com/login-page.html`;
      }
    }).catch(function (error) {
      alert("Failed")
      //add errors
    })
  }

  const reviewItems = (e: any) => {
    const sellerUsername = (document.getElementById("sellerUsername")).innerText;
    const data = { sellerUsername };

    instance.post("/reviewItems", data).then(function (response) {
      //do something here
      console.log(response)
      if (400 === response.data.statusCode) {
        alert(response.data.error);
      }
      else if (200 === response.data.statusCode) {
        // alert("items reviewed")
        setSellerItems(response.data.data);
      }
    }).catch(function (error) {
      alert("Failed")
      //add errors
    })
  }

  const handleFulfillItem = (itemID: any) => {
    let data = {itemID}

    instance.post('/fulfillItem', data).then(function (response) {
      if (response.data.statusCode === 400) {
        alert(response.data.error);
        reviewItems("");
        getBalance(username)
      }
      else if (response.data.statusCode === 200) {
        alert("Item Fulfilled");
        reviewItems("");
        getBalance(username)
      }
      else if (response.data.statusCode === 409) {
        alert("Could Not Fulfill Item");
        reviewItems("");
        getBalance(username)
      }
    }).catch(function (error) {
      alert("Failed")
    })      
  };

  const handleArchiveItem = (itemID: any) => {
    let data = {itemID}

    instance.post('/archive', data).then(function (response) {
      if (response.data.statusCode === 400) {
        alert(response.data.error);
      }
      else if (response.data.statusCode === 200) {
        alert("Item Archived");
        reviewItems("");
      }
      else if (response.data.statusCode === 409) {
        alert("Could Not Archive Item");
      }
    }).catch(function (error) {
      alert("Failed")
    })      
  };


  return (
    <main className="sellerMain">
      <div className="sellerUsername" id="sellerUsername">
        {username}
      </div>

      <div className="addItemForm">
        <label>Upload Image (required):</label>
        <input className="addItem-uploadImageInput" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageBase64)} required />

        <label>Item Name (required):</label>
        <input className="addItem-itemNameInput" type="text" placeholder="Item Name" required />

        <label>Description (required):</label>
        <input className="addItem-descriptionInput" type="text" placeholder="Description" required />

        <label>Initial Price (required):</label>
        <input className="addItem-initialPriceInput" type="text" placeholder="Initial Price" required />

        <label>End Date (required):</label>
        <input className="addItem-endDateInput" type="datetime-local" required/>


        <label>Buy now? (optional) <input type="checkbox" className="addItem-buyNow" id="addItem-buyNow"></input></label>

        <button className="addItemButton" onClick={handleAddItem}>Add Item</button>
      </div>

      <div className="editItemForm">
        <div>
          <label>{"Item ID (required):"}</label>
          <input className="editItem-itemID" type="text" placeholder="item id" required></input>
        </div>
        <div>
          <label>{"Upload image (required):"}</label>
          <input className="editItem-uploadImageInput" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageBase64)} required></input>
        </div>
        <div>
          <label>{"Item Name (required):"}</label>
          <input className="editItem-itemNameInput" type="text" placeholder="item name" required></input>
        </div>
        <div>
          <label>{"Description (required):"}</label>
          <input className="editItem-descriptionInput" type="text" placeholder="description" required></input>
        </div>
        <div>
          <label>{"Initial Price (required):"}</label>
          <input className="editItem-initialPriceInput" type="text" placeholder="initial price" required></input>
        </div>
        <div>
          <label>{"End Date (required): "}</label>
          <input className="editItem-endDateInput" type="datetime-local" placeholder="end date" required></input>
        </div>
        <div className='buyNowItemDiv'>
          <label>Buy now? (optional) <input type="checkbox" className="editItem-buyNow" id="editItem-buyNow"></input></label>
        </div>
        <div className='editItemButtonDiv'>
          <button className="editItemButton" onClick={handleEditItem}>{"Edit item"}</button>
        </div>
      </div>



      <div id="sellerBalance" className="sellerBalance">
        {balance !== null ? `$${balance}` : "Loading balance..."}
        <button className="closeAccountButton" onClick={closeSellerAccount}>Close Account</button>
      </div>

      <div className="sellerItems">
        <button className="reviewItems" onClick={(e) => reviewItems(e)}>{"Review Items"}</button>
        <label>Items: </label>

      </div>

      <div className="itemTable">
        {sellerItems && sellerItems.length > 0 ? (
          <table className="items">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Item Price</th>
                <th>Item Image</th>
                <th>Item Status</th>
                <th>Item ID</th>
                <th>Item Description</th>
                <th>Buy Now</th>
                <th>Fulfill Item</th>
                <th>Remove Item</th>
                <th>Archive Item</th>
                <th>Publish Item</th>
                <th>Unpublish Item</th>
                <th>Request Unfreeze</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Overall Status</th>
              </tr>
            </thead>
            <tbody>
              {sellerItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemName}</td>
                  <td>{item.price}</td>
                  <td><img className="itemImage" src={item.imageUrl} /></td>
                  <td> {item.isFrozen === "true" ? "FROZEN" : item.isActive === "true" ? "Active" : "Inactive"} </td>
                  <td>{item.id}</td>
                  <td>{item.description}</td>
                  <td>{item.buyNow}</td>
                  <td><button onClick={() => handleFulfillItem(item.id)} disabled={item.isArchived==='true' || item.isFrozen === "true" || item.isArchived==="true" || (item.isPublished==="false" && item.isActive==="false") || (item.isPublished==="true" && item.isActive==="true") || (item.isPublished==="true" && item.isActive==="false" && item.bids===null) || item.isFulfilled==='true'}>Fulfill Item</button></td>
                  <td><button onClick={() => handleRemoveItem(item.id)} disabled={item.isActive === "true" || item.isPublished === "true"}>Remove Item</button></td>
                  <td><button onClick={() => handleArchiveItem(item.id)} disabled={item.isFulfilled === "true" || item.isPublished === 'true' || item.isActive ==='true' || item.isArchived==='true'}>Archive Item</button></td>
                  <td><button onClick={() => handlePublishItem(item.id)} disabled={item.isArchived==='true' || item.isPublished === "true" || item.isActive==="true"}>Publish Item</button></td>
                  <td><button onClick={() => handleUnPublishItem(item.id)} disabled={item.isPublished === "false" || item.isFrozen === "true" || item.isArchived==="true" || (item.isPublished==="true" && item.isActive==="false" && item.bids===null)}>Unpublish Item</button></td>
                  <td><button onClick={() => handleRequestUnfreezeItemSeller(item.id)} disabled={item.isFrozen === "false"}>Request Unfreeze</button></td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                  <td>{getOverallStatus(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items to display</p>
        )}
      </div>


    </main >
  );
}