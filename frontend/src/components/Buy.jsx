import React, { useEffect, useState } from 'react'

function Buy({ accountData, transactionTypeData, tickerData }) {  
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accountType, setAccountType] = useState('N/A');

  const [selectedTicker, setSelectedTicker] = useState(tickerData.length > 0 ? tickerData[0].ticker : '');
  const [tickerInfo, setTickerInfo] = useState('N/A');

  const [selectedTransactionType, setSelectedTransactionType] = useState('');

  const [date, setDate] = useState('');

  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (accountData.length > 0 && !selectedAccount) {
      setSelectedAccount(accountData[0].name);
    }
  }, [accountData]);

  useEffect(() => {
    const account = accountData.find(account => account.name === selectedAccount);
    setAccountType(account ? account.type : 'N/A');
  }, [selectedAccount]);

  useEffect(() => {
    if (tickerData.length > 0 && !selectedTicker) {
      setSelectedTicker(tickerData[0].ticker);
    }
  }, [tickerData]);

  useEffect(() => {
    const fetchTickerInfo = async () => {
      if (selectedTicker == '') {
        setTickerInfo('N/A');
        return;
      }

      const info = await fetch(`http://localhost:5000/fetch-ticker-info?ticker=${selectedTicker}`);
      const data = await info.json();
    
      setTickerInfo(data.info); 
    };

    fetchTickerInfo();
  }, [selectedTicker]);

  useEffect(() => {
    if (transactionTypeData.length > 0 && !selectedTransactionType) {
      setSelectedTransactionType(transactionTypeData[0]);
    }
  }, [transactionTypeData]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');

    setDate(formattedDate);
  }, []);
  
  const handleSubmit = async (e) => {
    setIsProcessing(true);

    e.preventDefault();
    const formData = new FormData(e.target);

    if (!formData.get('account') || !formData.get('ticker') || !formData.get('transactionType') || formData.get('quantity') === '' || formData.get('price') === '') {
      setIsProcessing(false);
      return;
    }

    const response = await fetch('http://localhost:5000/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: formData.get('date'),
        account: formData.get('account'),
        accountType: accountType,
        ticker: formData.get('ticker'),
        transactionType: formData.get('transactionType'),
        quantity: formData.get('quantity'),
        price: formData.get('price')
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Bought ' + formData.get('quantity') + ' stocks of ' + formData.get('ticker') + ' at price $' + formData.get('price'));

      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
      }, 2000);
    } else {
      console.log('Error:', result.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='min-h-screen bg-gray-800'>
          <div className='bg-gray-100 px-5 border-b border-gray-900/10 pb-12'>
            <div className='pt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-2'>
                <label htmlFor='date' className='block text-sm/6 font-medium text-gray-900'>Date </label>
                <div className='mt-2'>
                  <input type='date' name='date' id='date' value={date} onChange={(e) => setDate(e.target.value)} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'/>                  
                </div>
              </div>
            </div>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='account' className='block text-sm/6 font-medium text-gray-900'>Account </label>
                <div className='mt-2'>
                  <select name='account' id='account' value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                    {accountData.map((account) => (
                      <option key={account.name} value={account.name}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                  
                  {selectedAccount.length === 0 && <p className='mt-1 text-sm/6 text-red-600'>No accounts available</p>}
                  {accountType != 'N/A' && <p className='mt-1 text-sm/6 text-gray-600 px-3'>{accountType}</p>}
                </div>
              </div>
            </div>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='ticker' className='block text-sm/6 font-medium text-gray-900'>Ticker </label>
                <div className='mt-2'>
                  <select name='ticker' id='ticker' value={selectedTicker} onChange={(e) => setSelectedTicker(e.target.value)} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                    {tickerData.map((ticker) => (
                      <option key={ticker.ticker} value={ticker.ticker}>
                        {ticker.ticker}
                      </option>
                    ))}
                  </select>
                  {selectedTicker.length === 0 && <p className='mt-1 text-sm/6 text-red-600'>No tickers available</p>}
                  {<p className='mt-1 text-sm/6 text-gray-600 px-3'>{tickerInfo}</p>}
                </div>
              </div>
            </div>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='transaction-type' className='block text-sm/6 font-medium text-gray-900'>Transaction Type </label>
                <div className='mt-2'>
                  <select name='transactionType' id='transaction-type' value={selectedTransactionType} onChange={(e) => setSelectedTransactionType(e.target.value)} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                    {transactionTypeData.map((transactionType) => (
                      <option key={transactionType.name} value={transactionType.name}>
                        {transactionType.name}
                      </option>
                    ))}
                  </select>

                  {selectedTransactionType.length === 0 && <p className='mt-1 text-sm/6 text-red-600'>No transaction types available</p>}
                </div>
              </div>
            </div>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='quantity' className='block text-sm/6 font-medium text-gray-900'>Purchase Quantity </label>
                <div className='mt-2'>
                  <input type='number' name='quantity' id='quantity' step='0.0001' value={quantity} onChange={(e) => setQuantity(e.target.value)} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'/>
                  {quantity.length === 0 && <p className='mt-1 text-sm/6 text-red-600'>Cannot be empty</p>}
                </div>
              </div>
            </div>   
            
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='price' className='block text-sm/6 font-medium text-gray-900'>Purchase Price </label>
                <div className='mt-2'>
                  <div className='flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600'>
                    <div className='shrink-0 select-none text-base text-gray-500 sm:text-sm/6'>$</div>
                    <input type='number' name='price' id='price' step='0.001' value={price} onChange={(e) => setPrice(e.target.value)} className='block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6'/>
                  </div>

                  {price.length === 0 && <p className='mt-1 text-sm/6 text-red-600'>Cannot be empty</p>}
                </div>
              </div>
            </div>

            <div className='mt-10 flex items-center gap-x-6'>
              <button type='submit' disabled={isProcessing || isSuccess} 
                className={`flex items-center justify-center rounded-md bg-gray-800 text-sm font-semibold text-white shadow-sm
                ${isProcessing ? 'cursor-not-allowed' : isSuccess ? 'hidden' : 'hover:bg-gray-700'}`}
                style={{
                  width: '103.75px',
                  height: '36px',
                }}
              >
                {isProcessing && (
                  <span className='loader'></span>
                )} 
                
                {!isProcessing && !isSuccess && (
                  <span>Buy</span>
                )}
              </button>

              {isSuccess && (
                <div className='success-circle'>
                  <span className='checkmark'>✓</span>
                </div>
              )} 
            </div>
          </div>
        </div>
      </form>

      <style jsx='true'>{`
        .loader {
          border: 2px solid #f3f3f3; /* Light grey */
          border-top: 2px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 14px;
          height: 14px;
          animation: spin 1s linear infinite;
        }

        /* Loading animation */
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .success-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #1f2937;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0); /* Start hidden */
          animation: success-grow 0.5s forwards ease-in-out, fade-out-check 1s 2s forwards ease-in-out;;
        }

        .checkmark {
          color: white;
          font-size: 18px;
          font-weight: bold;
        }

        /* Success animation */
        @keyframes success-grow {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default Buy;