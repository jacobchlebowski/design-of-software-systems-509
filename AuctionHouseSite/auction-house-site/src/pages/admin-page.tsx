'use client'
import React, { useEffect, useState } from 'react';
import './admin-page.css';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://0sy7wxlvx0.execute-api.us-east-2.amazonaws.com/AuctionHouse'
});


export default function AdminPage() {
  const [adminItems, setAdminItems] = useState([]);
  const [reportContent, setReportContent] = useState([]);
  const [balance, setBalance] = useState<string>("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const getBalance = (e: any) => {
    const username = "auction"
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


  const generateReport = () => {
    const name = "auction";
    let data  = {name}
    instance.post("/generateAuctionReport").then(function (response) {
      //do something here
      console.log(response)
      if (400 === response.data.statusCode) {
        alert(response.data.error);
      }
      else if (200 === response.data.statusCode) {
        console.log(response.data.value.balance)

        setBalance(response.data.value.balance);
        setReportContent(response.data.value.data)
      }
      else if (201 === response.data.statusCode) {
        setReportContent([])
      }
    }).catch(function (error) {
      alert("Failed")
      //add errors
    })
  };

  const generateForensicsReport = () => {
    const start = startDate !== '' ? startDate : '0000-01-01';
    const end = endDate !== '' ? endDate : '9999-12-31';
    const min = minPrice !== '' ? minPrice : 0;
    const max = maxPrice !== '' ? maxPrice : 100000000;
    console.log(start, end, min, max)
    let data  = {start, end, min, max};
    console.log(data)
    instance.post("/generateForensicReport", data).then(function (response) {
      //do something here
      console.log(response)
      if (400 === response.data.statusCode) {
        alert(response.data.error);
      }
      else if (200 === response.data.statusCode) {
        console.log(response.data.value.balance)
        setReportContent(response.data.value.data)
      }
      else if (201 === response.data.statusCode) {
        setReportContent([])
      }
    }).catch(function (error) {
      alert("Failed")
      //add errors
    })
  };

  //handlefreezeItem
  const handlefreezeItem = (itemID: any) => {
    const data = { itemID };
    instance.post('/freezeitemAdmin', data)
      .then(response => {
        if (response.data.statusCode === 200) {
          alert('Item successfully frozen');
          setAdminItems(response.data.data);
          console.log(response.data.data)
          adminPopulateItems("")
        } else {
          alert(response.data.error);
        }
      })
      .catch(() => alert('Failed to freeze item.'));
  };
  //handleunfreezeItem
  const handleunfreezeItem = (itemID: any) => {
    const data = { itemID };
    instance.post('/unfreezeitemAdmin', data)
      .then(response => {
        if (response.data.statusCode === 200) {
          alert('Item successfully unfrozen');
          setAdminItems(response.data.data);
          adminPopulateItems("")
        } else {
          alert(response.data.error);
        }
      })
      .catch(() => alert('Failed to unfreeze item.'));
  };

  const adminPopulateItems = (e: any) => {
    const username = "admin"
    const data = { username };

    console.log("sending data...")
    console.log(data)
    instance.post("/adminPopulateItems", data).then(function (response) {
      //do something here
      if (400 === response.data.statusCode) {
        alert(response.data.error);
      }
      else if (200 === response.data.statusCode) {
        // alert("items reviewed")
        console.log(response.data.data)
        setAdminItems(response.data.data);
      }
    }).catch(function (error) {
      alert("Failed")
      //add errors
    })
  };

  getBalance("auction");

  return (
    <div className="page-container">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
          <div className="adminBalance">
            admin
          </div>
          <div id="adminBalance" className="adminBalance">
            {balance !== null ? `House Funds: $${Number(balance).toFixed(2)}` : "Loading balance..."}
          </div>

          <div className="adminItems">
            <button className="reviewItems" onClick={(e) => adminPopulateItems(e)}>{"Populate Items"}</button>
            <label>Items: </label>

          </div>

          <div className="itemTable">
            {adminItems && adminItems.length > 0 ? (
              <table className="items">
                <thead>
                  <tr>
                    <th>Item |</th>
                    <th>Freeze Item |</th>
                    <th>Unfreeze Item |</th>
                    <th>Requested to be unfrozen?</th>
                  </tr>
                </thead>
                <tbody>
                  {adminItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td><button className="freezeItem" disabled={item.isFrozen === "true"} onClick={() => handlefreezeItem(item.id)}>Freeze Item</button></td>
                      <td><button className="unfreezeItem" disabled={item.isFrozen === "false"} onClick={() => handleunfreezeItem(item.id)}>Unfreeze Item</button></td>
                      <td>{item.requestUnfreeze}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No items to display</p>
            )}
          </div>

        </div>
        <div className="report-container">
          <div className="report-div">
            <div className="report-title">Report</div>
              <div className="itemTable" style={{ display: 'flex', justifyContent: 'center' }}>
                {reportContent && reportContent.length > 0 ? (
                  <table className="items">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Profit</th>
                        <th>Sale Date</th>
                        <th>Seller</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportContent.map((item, index) => (
                        <tr key={index}>
                          <td>{item.itemName}</td>
                          <td>{Number(item.price).toFixed(2)}</td>
                          <td>{item.saleDate}</td>
                          <td>{item.seller}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No items to display</p>
                )}
              </div>
            </div>
          </div>
        </div>
      <div className="bottom-buttons">
        <button className="button" onClick={generateReport}>
          Generate Report
        </button>
        <div className="forensics-filters">
          <label>
            Start Date:
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            End Date:
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <label>
            Min Price:
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </label>
          <label>
            Max Price:
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </label>
        </div>
        <button className="button" onClick={generateForensicsReport}>
          Generate Forensics Report
        </button>
      </div>
    </div>
  );
}