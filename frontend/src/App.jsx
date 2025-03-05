import HomePage from './pages/HomePage'
import BuyPage from './pages/BuyPage'
import SellPage from './pages/SellPage'
import AdminPage from './pages/AdminPage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <main className='main-content'>
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/buy' element={<BuyPage />}/>
        <Route path='/sell' element={<SellPage />}/>
        <Route path='/admin' element={<AdminPage />}/>
      </Routes>
    </main>
  );
}

export default App;