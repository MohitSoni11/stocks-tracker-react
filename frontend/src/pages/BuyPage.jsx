import React, { useEffect, useState } from 'react'
import Buy from '../components/Buy.jsx'
import Navbar from '../components/Navbar.jsx'

function HomePage() {
  const [accountData, setAccountData] = useState([]);
  const [transactionTypeData, setTransactionTypeData] = useState([]);
  const [tickerData, setTickerData] = useState([]);

  const fetchAccounts = async () => {
    const response = await fetch('http://localhost:5000/fetch-accounts');
    const data = await response.json();
    setAccountData(data.accounts);
  };

  const fetchTransactionTypes = async () => {
    const response = await fetch('http://localhost:5000/fetch-transaction-types');
    const data = await response.json();
    setTransactionTypeData(data.types);
  };

  const fetchTickers = async () => {
    const response = await fetch('http://localhost:5000/fetch-tickers');
    const data = await response.json();
    setTickerData(data.tickers);
  };

  useEffect(() => {
    fetchAccounts();
    fetchTransactionTypes();
    fetchTickers();
  }, []);

  return (
    <>
      <Navbar />
      <Buy accountData = {accountData} transactionTypeData = {transactionTypeData} tickerData = {tickerData} />
    </>
  );
}

export default HomePage;