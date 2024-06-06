import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContextProvider';

export default function InfoBar() {
  const {token} = useContext(UserContext);

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('User');
        return storedUser ? JSON.parse(storedUser) : '';
    });

    const [purchases, setPurchases] = useState(0);
    const [numberProducts, setNumberProducts] = useState(0);

    const name = user ? user.username : null;
    const ruolo = user ? user.ruolo : ''; 

    const fetchPurchases = async () =>{
      try {
        const response = await fetch(`http://localhost:3001/seller/purchases`,{
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        setPurchases(data.totalAcquistiEffettuati);
      

      } catch (error) {
        console.log(error);
      }
    }

    const countProducts = async() =>{
      try {
        const response = await fetch(`http://localhost:3001/seller/products`,{
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        setNumberProducts(data.numero);
        

      } catch (error) {
        console.log(error);
      }
    }

    const fetchUser = async() =>{
      try {
        const response = await fetch(`http://localhost:3001/auth/me`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data); 
        console.log(data.avatar);
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(()=>{
      if(token){
        fetchUser();
        if(user.ruolo === 'seller'){
          countProducts();
          fetchPurchases();
        }
      }
      
    }, [token])


  return (
    <Container fluid className='text-light mx-auto' style={flexContainer}>
        {ruolo === 'user' && 
        <>
            {user.avatar ? <img src={user.avatar} style={img} alt='avatar' className='me-3'/>
             : <div style={imgEmpty} className='me-3'/>}
            <h4>Bentornato {name && name}</h4>
            <Link to="/account/cart" className='text-light ms-3'><Button className='orange-color'>Vai al carrello</Button></Link>
            <Link to="/account" className='text-light ms-3'><Button className='user-button'>Profilo</Button></Link>
        </>
        } 
        {ruolo === '' && <Link to='/login'><Button variant='success'>Accedi per visualizzare la toolbar</Button></Link>}
        {ruolo === 'seller' && 
        <>
          {user.avatar ? <img src={user.avatar} style={img} alt='avatar' className='me-3'/>
          : <div style={imgEmpty} className='me-3'/>}
          <h4>Società: {name}</h4>
          <Link to="/account/products" className='text-light mx-3'><Button className='orange-color'>Accedi ai tuoi prodotti</Button></Link>
          <p className='m-2'>Prodotti inseriti: <b>{numberProducts}</b></p>
          <p className='m-2'>Numero vendite:  <b>{purchases}</b></p>
        </>
        }
        {ruolo === 'admin' && 
          <Container fluid style={flexContainer}>
          {user.avatar ? <img src={user.avatar} style={img} alt='avatar' className='me-3'/>
          : <div style={imgEmpty} className='me-3'/>}
          <h4>Admin: {name}</h4>
          <Link to="/account/database" className='text-light mx-5'>
            <Button className='orange-color'>Accedi ai database</Button>
          </Link>
        </Container>
        }

    </Container>
  )
}

const flexContainer ={
  display: 'flex',
  alignItems: "center",
  height: "100%"
}

const img = {
  width: "50px",
  height: "50px", 
  objectFit: "cover",
  borderRadius: "50%"
}

const imgEmpty = {
  width: "50px",
  height: "50px", 
  backgroundColor: "gray",
  borderRadius: "50%"
}
