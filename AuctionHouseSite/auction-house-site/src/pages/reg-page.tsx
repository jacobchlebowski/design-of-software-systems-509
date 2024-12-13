'use client';
import React from 'react';
import './reg-page.css';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://0sy7wxlvx0.execute-api.us-east-2.amazonaws.com/AuctionHouse'
});

export default function RegisterPage() {
  const handleRegister = () => {
    const username = (document.querySelector('#username') as HTMLInputElement).value;
    const password = (document.querySelector('#password') as HTMLInputElement).value;
    const accountType = (document.querySelector('#accountType') as HTMLSelectElement).value;

    let data = { username, password, accountType };
    console.log("sending", data);

    instance.post("/register", data)
      .then(function (response) {
        if (response.data.statusCode !== 200) {
          alert(response.data.error);
        } else if (response.data.statusCode === 200) {
          alert("Register Successful");
          //window.location.href = 'http://localhost:3000/login-page';
          window.location.href = `https://auctionhouse24.s3.us-east-2.amazonaws.com/login-page.html`;
        }
      })
      .catch(function (error) {
        alert("Failed");
      });
  };

  return (
    <main style={{ width: '300px', margin: '0 auto', alignItems: 'center' }}>
      <h1>Register Account</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ width: '80px' }}>Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter Username"
          style={{ flex: 1, padding: '8px' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ width: '80px' }}>Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Enter Password"
          style={{ flex: 1, padding: '8px' }}
        />
      </div>

      <div className="Register">
        <button className="registerButton" onClick={handleRegister}>Register</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ width: '80px' }}>Options:</label>
        <select
          id="accountType"
          style={{ flex: 1, padding: '8px' }}
        >
          <option value="Seller">Seller</option>
          <option value="Buyer">Buyer</option>
        </select>
      </div>
    </main>
  );
}
