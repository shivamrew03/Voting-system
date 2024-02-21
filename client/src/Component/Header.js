import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../Component/Styles/Home.css';
import abi from "../abis/Data.json";

const { ethers} = require("ethers"); // Ensure correct import for your Ethers.js version

function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        alert("MetaMask extension not detected. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };
  

  const handleUserLinkClick = async () => {
    if (isConnected) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
      try {
        const contract = new ethers.Contract(
          contractAddress,
          abi,
          provider
        );
        // console.log(contract);
        const output = (await signer).address;
        const check = await contract.userExist(output);
        // await console.log(check);
        if (check) {
          navigate("/user");
        } else {
          navigate("/newuser");
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
      }
    } else {
      // Handle the case where the user is not connected
      alert("Please connect your wallet before navigating to the user page.");
    }
  };
  

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const address = accounts[0];
            setIsConnected(true);
            setAccount(address);
          } else {
            setIsConnected(false);
            setAccount("");
          }
        } else {
          setIsConnected(false);
          setAccount("");
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error);
        setIsConnected(false);
        setAccount("");
      }
    };
  
    checkConnection();
    // Add an event listener to detect MetaMask connection changes
    window.ethereum.on("accountsChanged", (accounts) => {
      checkConnection();
    });
  }, [setIsConnected, setAccount]); // Include dependencies for re-running
  

  return (
    <>
      <header className="header">
        {/* <h1>addres is {process.env.REACT_API_KEY}</h1> */}
        {/* {console.log(process.env.REACT_APP_API_KEY)} */}
        <div className="header-name"></div>
        <ul className="header-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
  
            <Link to="/contact">Contact Us</Link>
          </li>
          <li>
            {/* <a onClick={handleUserLinkClick} style={}>User</a> */}
            {/* <Link onClick={handleUserLinkClick}>User</Link> */}
            {/* <img src="" alt="" /> */}
            <button  onClick={handleUserLinkClick}>User</button>
          </li>
        </ul>
        <div className="wallet-section">
          {isConnected ? (
            <div className="wallet-box">
              <p className="wallet-address">
                Connected: {`${account.substring(0, 3)}...${account.slice(-3)}`}
              </p>
            </div>
          ) : (
            <button className="wallet-box" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;