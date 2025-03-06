import React, { useEffect, useState } from 'react'
import { API_URL } from '../config';

function TransactionType({}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    setIsProcessing(true);

    e.preventDefault();
    const formData = new FormData(e.target);

    if (formData.get('name') === '') {
      setIsProcessing(false);
      return;
    }

    const response = await fetch(`${API_URL}/add-transaction-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name') 
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Added Transaction Type: ' + formData.get('name'));
    
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
        <div className='bg-gray-800'>
          <div className='bg-gray-100 px-5 border-b border-gray-900/10 pb-12'>
            <h2 className='pt-5 text-base/7 font-semibold text-gray-900'>Add Transaction Type</h2>
            
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='name' className='block text-sm/6 font-medium text-gray-900'>Type Name</label>
                <div className='mt-2'>
                  <input type='text' name='name' id='name' className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'/>
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
                  <span>Add</span>
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

export default TransactionType;