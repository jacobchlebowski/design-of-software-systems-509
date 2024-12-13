'use client'
import React from 'react'
import './login-page.css';
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://0sy7wxlvx0.execute-api.us-east-2.amazonaws.com/AuctionHouse'
})

export default function LoginPage() {
    //RENDER'
    const handleLogin = () => {
      
      const username = (document.getElementById("username") as HTMLInputElement).value;
      const password = (document.getElementById("password") as HTMLInputElement).value;
      let data = {username, password};

      console.log("sending", data);
      instance.post("/loginSeller", data).then(function (response) {
        if (400 === response.data.statusCode) {
          alert(response.data.error);
        }
        else if (200 === response.data.statusCode) {
          alert("Login Successful")
          //window.location.href = `http://localhost:3000/seller-page?username=${encodeURIComponent(username)}`;
          window.location.href = `https://auctionhouse24.s3.us-east-2.amazonaws.com/seller-page.html?username=${encodeURIComponent(username)}`;
        }
        else if (201 === response.data.statusCode) {
          alert("Login Successful")
          //window.location.href = `http://localhost:3000/buyer-page?username=${encodeURIComponent(username)}`;
          window.location.href = `https://auctionhouse24.s3.us-east-2.amazonaws.com/buyer-page.html?username=${encodeURIComponent(username)}`;
        }
        else if (202 === response.data.statusCode) {
          alert("Admin Login Successful")
          //window.location.href = `http://localhost:3000/buyer-page?username=${encodeURIComponent(username)}`;
          window.location.href = "https://auctionhouse24.s3.us-east-2.amazonaws.com/admin-page.html";
        }
        }).catch(function (error) {
          alert("Failed")
        })
    }


    //Handle registration
    const handleRegistrationClick = () => {
      //window.location.href = 'http://localhost:3000/reg-page';
      window.location.href = `https://auctionhouse24.s3.us-east-2.amazonaws.com/reg-page.html`;
    }

    //Handle registration
    const handleCustomerLoginClick = () => {
      //window.location.href = 'http://localhost:3000/reg-page';
      window.location.href = `http://auctionhouse24.s3-website.us-east-2.amazonaws.com/customer-page.html`;
    }

    return(
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

          <div className="Register">
            <button className="registerButton" onClick={handleRegistrationClick}>Register</button>
          </div>

          <div className="Login">
            <button className="loginButton" onClick={handleLogin}>Login</button>
          </div>

          <div className="customerLogin">
            <button className="customerLoginButton" onClick={handleCustomerLoginClick}>Customer Login</button>
          </div>


          <div>
            <label>{"Username: "}</label>
            <input className="usernameInput" type="text" placeholder="username" id="username"></input>
          </div>

          <div>
            <label>{"Password: "}</label>
            <input className="passwordInput" type="password" placeholder="password" id="password"></input>
          </div>
        </main>
    );
}
