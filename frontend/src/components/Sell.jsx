import React, { useEffect, useState } from 'react'
import { API_URL } from '../config';

function Sell({ tickerData }) {
  const [selectedTicker, setSelectedTicker] = useState('');
  const [selectedLot, setSelectedLot] = useState('');
  const [lotData, setLotData] = useState([]);

  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [fee, setFee] = useState('');

  const [currentPrice, setCurrentPrice] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchLots = async () => {
    const lots = await fetch(`${API_URL}/fetch-lots?ticker=${selectedTicker}`);
    const data = await lots.json();
    setLotData(data.lots);
  };

  const fetchCurrentPrice = async () => {
    if (selectedTicker == '') {
      setCurrentPrice('N/A');
      return;
    }

    const price = await fetch(`${API_URL}/fetch-current-price?ticker=${selectedTicker}`);
    const data = await price.json();
    setCurrentPrice(data.price);
  }

  useEffect(() => {
    if (tickerData.length > 0 && !selectedTicker) {
      setSelectedTicker(tickerData[0].ticker);
    }
  }, [tickerData]);

  useEffect(() => {
    fetchLots();
    fetchCurrentPrice();
  }, [selectedTicker]);

  useEffect(() => {
    if (lotData.length > 0 && !selectedLot) {
      setSelectedLot(lotData[0].lot);
    } else {
      setSelectedLot('');
    }
  }, [lotData]);

  const handleSubmit = async (e) => {
    setIsProcessing(true);

    e.preventDefault();
    const formData = new FormData(e.target);

    if (!formData.get('ticker') || !formData.get('lot') || formData.get('quantity') === '' || formData.get('quantity') > (lotData.find(lot => lot.lot === selectedLot)?.buyQuantity - lotData.find(lot => lot.lot === selectedLot)?.sellQuantity) || formData.get('price') === '' || formData.get('fee') === '') {
      setIsProcessing(false);
      return;
    }

    const response = await fetch(`${API_URL}/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker: formData.get('ticker'),
        lot: formData.get('lot'),
        quantity: formData.get('quantity'),
        price: formData.get('price'),
        fee: formData.get('fee')
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Sold ' + formData.get('quantity') + ' stocks of ' + formData.get('ticker') + ' at price $' + formData.get('price'));
      fetchLots();
    
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
                </div>
              </div>
            </div>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='lot' className='block text-sm/6 font-medium text-gray-900'>Lot </label>
                <div className='mt-2'>
                  <select name='lot' id='lot' value={selectedLot} onChange={(e) => setSelectedLot(e.target.value)} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                    {lotData.map((lot) => (
                      <option key={lot.lot} value={lot.lot}>
                        {lot.lot}
                      </option>
                    ))}
                  </select>
                  {selectedLot.length === 0 && <p className='mt-1 text-sm/6 text-red-600'>No lots available</p>}
                </div>
              </div>
            </div>

            {lotData.length !== 0 && 
              <div className="mt-5 relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                <table id='lot-table' className="w-full text-center table-auto min-w-max">
                  <thead className='bg-slate-600'>
                    <tr>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-gray-100 opacity-95'>ID</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Account Type</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Account</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Bought Qty</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Buy Price</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Bought Amount</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Remaining Qty</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Current Price</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Remaining Amount</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Sold Qty</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Avg Sold Price</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Total Sold Amount</p>
                      </th>
                      <th className="p-4 border-b border-slate-200">
                        <p className='block font-sans text-sm antialiased font-semibold leading-none text-white opacity-95'>Gain</p>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {lotData.map((lot) => (
                      <tr key={lot.lot}>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {lot.lot}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {lot.accountType}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {lot.account}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {lot.buyQuantity}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {lot.buyPrice}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {(lot.buyQuantity * lot.buyPrice).toFixed(2)}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {lot.buyQuantity - lot.sellQuantity}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {currentPrice}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {((lot.buyQuantity - lot.sellQuantity) * currentPrice).toFixed(2)}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {lot.sellQuantity}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {(lot.sellReturn / lot.sellQuantity).toFixed(2)}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {lot.sellReturn}
                          </p>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50'>
                          <p className={`block font-sans text-sm antialiased font-normal leading-normal 
                          ${((lot.buyQuantity - lot.sellQuantity) * currentPrice) + lot.sellReturn - (lot.buyQuantity * lot.buyPrice) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {(((lot.buyQuantity - lot.sellQuantity) * currentPrice) + lot.sellReturn - (lot.buyQuantity * lot.buyPrice)).toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td colSpan={12} className="p-4 text-right border-b border-blue-gray-50">
                        <p className='block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900'>
                          Total:
                        </p>
                      </td>
                      <td className="p-4 text-right border-b border-blue-gray-50">
                        <p className={`block font-sans text-sm antialiased font-bold leading-normal
                        ${lotData.reduce((total, lot) => {
                            return (
                              total +
                              (lot.buyQuantity - lot.sellQuantity) * currentPrice +
                              lot.sellReturn -
                              lot.buyQuantity * lot.buyPrice
                            );
                          }, 0) < 0
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}>

                          {lotData.reduce((total, lot) => {
                            const gain = ((lot.buyQuantity - lot.sellQuantity) * currentPrice) + lot.sellReturn - (lot.buyQuantity * lot.buyPrice);
                            return total + gain;
                          }, 0).toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>}

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='quantity' className='block text-sm/6 font-medium text-gray-900'>Sell Quantity </label>
                <div className='mt-2'>
                  <input type='number' name='quantity' id='quantity' step='0.0001' value={quantity} onChange={(e) => setQuantity(e.target.value)} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'/>
                  {quantity.length === 0 && <p className='mt-1 text-sm/6 text-red-600'>Cannot be empty</p>}
                  {Number(quantity) > (lotData.find(lot => lot.lot === selectedLot)?.buyQuantity - lotData.find(lot => lot.lot === selectedLot)?.sellQuantity) && <p className='mt-1 text-sm/6 text-red-600'>Cannot sell more than remaining</p>}
                </div>
              </div>
            </div>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='price' className='block text-sm/6 font-medium text-gray-900'>Sell Price </label>
                <div className='mt-2'>
                  <div className='flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600'>
                    <div className='shrink-0 select-none text-base text-gray-500 sm:text-sm/6'>$</div>
                    <input type='number' name='price' id='price' placeholder={currentPrice} step='0.001' value={price} onChange={(e) => setPrice(e.target.value)} className='block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6'/>
                  </div>

                  {price.length === 0 && <p className='mt-1 text-sm/6 text-red-600'>Cannot be empty</p>}
                </div>
              </div>
            </div>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='fee' className='block text-sm/6 font-medium text-gray-900'>Commission/Fee </label>
                <div className='mt-2'>
                  <div className='flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600'>
                    <div className='shrink-0 select-none text-base text-gray-500 sm:text-sm/6'>$</div>
                    <input type='number' placeholder='0' name='fee' id='fee' step='0.001' value={fee} onChange={(e) => setFee(e.target.value)} className='block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6'/>
                  </div>

                  {fee.length === 0 && <p className='mt-1 text-sm/6 text-red-600'>Cannot be empty</p>}
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
                  <span>Sell</span>
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

export default Sell;