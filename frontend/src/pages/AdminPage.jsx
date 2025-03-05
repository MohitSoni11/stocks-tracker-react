import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import AccountType from '../components/AccountType'
import Account from '../components/Account'
import TransactionType from '../components/TransactionType'
import Ticker from '../components/Ticker'
import Delete from '../components/Delete'

function AdminPage() {
  const [typeData, setTypeData] = useState([]);

  const fetchAccountTypes = async () => {
    const response = await fetch('http://localhost:5000/fetch-account-types');
    const data = await response.json();
    setTypeData(data.types);
  };

  const deleteAccountTypes = async () => {
    const response = await fetch('http://localhost:5000/delete-account-types');
    const data = await response.json();

    if (data.success) {
      console.log('Deleted all Account Types.');
    }

    setTypeData([]);
  }

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  return (
    <>
      <Navbar />
      <AccountType fetchAccountTypes = {fetchAccountTypes} />
      <Account typeData = {typeData} />
      <TransactionType />
      <Ticker />
      <Delete deleteAccountTypes = {deleteAccountTypes} />
    </>
  );
}

export default AdminPage;