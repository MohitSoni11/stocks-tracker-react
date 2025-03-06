import React, { useEffect, useState } from 'react'
import { API_URL } from '../config';

function Delete({deleteAccountTypes}) {
  const handleAccounts = async (e) => {
    const response = await fetch(`${API_URL}/delete-accounts`);
    const data = await response.json();

    if (data.success) {
      console.log('Deleted all Accounts.');
    }
  }

  const handleTickers = async (e) => {
    const response = await fetch(`${API_URL}/delete-tickers`);
    const data = await response.json();

    if (data.success) {
      console.log('Deleted all Tickers.');
    }
  }

  const handleTransactionTypes = async (e) => {
    const response = await fetch(`${API_URL}/delete-transaction-types`);
    const data = await response.json();

    if (data.success) {
      console.log('Deleted all Transaction Types.');
    }
  }

  const handleLots = async (e) => {
    const response = await fetch(`${API_URL}/delete-lots`);
    const data = await response.json();

    if (data.success) {
      console.log('Deleted all Buy/Sell Lots.');
    }
  }

  return (
    <>
      <div className='bg-gray-800'>
        <div className='bg-gray-100 px-5 border-b border-gray-900/10 pb-12'>
          <div className='pt-5 flex items-center gap-x-6'>
            <button type='submit' onClick={deleteAccountTypes} className='flex p-5 items-center justify-center rounded-md bg-gray-800 text-sm font-semibold text-white shadow-sm hover:bg-gray-700'>
              Delete Account Types
            </button>
          </div>

          <div className='pt-5 flex items-center gap-x-6'>
            <button type='submit' onClick={handleAccounts} className='flex p-5 items-center justify-center rounded-md bg-gray-800 text-sm font-semibold text-white shadow-sm hover:bg-gray-700'>
              Delete Accounts
            </button>
          </div>

          <div className='pt-5 flex items-center gap-x-6'>
            <button type='submit' onClick={handleTickers} className='flex p-5 items-center justify-center rounded-md bg-gray-800 text-sm font-semibold text-white shadow-sm hover:bg-gray-700'>
              Delete Tickers
            </button>
          </div>

          <div>
            <div className='pt-5 flex items-center gap-x-6'>
              <button type='submit' onClick={handleTransactionTypes} className='flex p-5 items-center justify-center rounded-md bg-gray-800 text-sm font-semibold text-white shadow-sm hover:bg-gray-700'>
                Delete Transaction Types
              </button>
            </div>

            <div className='pt-5 flex items-center gap-x-6'>
              <button type='submit' onClick={handleLots} className='flex p-5 items-center justify-center rounded-md bg-gray-800 text-sm font-semibold text-white shadow-sm hover:bg-gray-700'>
                Delete Buy & Sell Lots
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Delete;