import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sell from '../components/Sell'

function SellPage() {
  const [tickerData, setTickerData] = useState([]);

  const fetchTickers = async () => {
    const response = await fetch('http://localhost:5000/fetch-tickers');
    const data = await response.json();
    setTickerData(data.tickers);
  };

  useEffect(() => {
    fetchTickers();
  }, []);
    
  return (
    <>
      <Navbar />
      <Sell tickerData = {tickerData}/>
    </>
  );
}

export default SellPage;