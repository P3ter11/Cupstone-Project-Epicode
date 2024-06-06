import { Container, Row, Col } from 'react-bootstrap';
import NavBar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Ospite/Home';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import InfoProduct from './components/Prodotti/InfoProduct';
import Login from './components/Utenti/Login';
import Register from './components/Utenti/Register';
import UserContextProvider from './components/UserContextProvider';
import Account from './components/Utenti/Account';
import ProtectedAuthRoutes from './components/ProctectedAuthRoutes';
import Cart from './components/Utenti/Cart';
import { useState } from 'react';
import ProductsSeller from './components/Prodotti/ProductsSeller';
import DatabaseAdmin from './components/Utenti/DatabaseAdmin';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <UserContextProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    

      <Route element={<ProtectedAuthRoutes/>}>
        <Route path="/account" element={<Account />} />
        <Route path='/account/cart' element={<Cart/>}/>
        <Route path='/account/products' element={<ProductsSeller/>}/>
        <Route path='/account/database' element={<DatabaseAdmin/>}/>
      </Route>
    

      
        
        <Route path="/" element={<div><NavBar setSearchQuery={setSearchQuery}/><Home searchQuery={searchQuery}/></div>} />
        <Route path="/info-product/:productId" element={<div><NavBar/><InfoProduct /></div>} />
      </Routes>
    </BrowserRouter>
    
    
    </UserContextProvider>
    

  );

}

export default App;
