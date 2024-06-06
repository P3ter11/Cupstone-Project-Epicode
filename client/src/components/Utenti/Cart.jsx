import React, { useEffect } from 'react';
import { Row, Col, Button, Alert, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContextProvider';
import { useContext, useState } from 'react';

export default function Cart() {
    const {token} = useContext(UserContext);

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('User');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const userId = user ? user._id : null;
    

    const [cartData, setCartData] = useState([]);

    const [isBought, setIsBought] = useState(false);
    const [isRemoved, setIsRemoved] = useState(false);

    useEffect(() => {
        fetchCart()
    }, [userId]);

    const fetchCart = async() =>{
        try {
            const response = await fetch(`http://localhost:3001/user/${userId}/cart`,{
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`}
            });
            if(!response.ok)
                throw new Error("Errore nella ricerca dei dati dell'utente");

            const data = await response.json();
            setCartData(data);
            console.log(data);
    
        } catch (error) {
            throw new Error("Errore nella ricerca dei dati dell'utente");
        }
    }

    const buyProducts = async()=>{
        try {
            const response = await fetch(`http://localhost:3001/user/buy`,{
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`}
            });
            if(!response.ok)
                throw new Error("Errore durante l'acquisto dei prodotti");

            setIsBought(true);
            setTimeout(() => setIsBought(null), 3000);
            fetchCart();
        } catch (error) {
            throw new Error("Errore durante l'acquisto dei prodotti");
        }
    }

    const removeProduct = async(productId) =>{
        try {
            const response = await fetch(`http://localhost:3001/user/deleteProduct/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok)
                throw new Error("Errore durante la rimozione di un prodotto dal carrello");

            
            setIsRemoved(true);
            setTimeout(() => setIsRemoved(null), 3000);
            fetchCart();

        } catch (error) {
            throw new Error("Errore durante la rimozione di un prodotto dal carrello");
        }
    }


  return (
    <>
    <Container fluid style={{width: "50%"}} className='bg-dark text-light my-5 p-4'>
        {cartData.length > 0 ?
            cartData.map((item) =>{
                return(
                    <Card className='rounded-0 bg-dark text-light m-3' key={item.prodotto._id}>
                        <Row>
                        <Col lg={4} xs={12}>
                            <Card.Img 
                            className='rounded-0'
                            src={item.prodotto.immagine} 
                            alt="Product Image" 
                            style={{ width: '100%', height: '100%', objectFit: "cover"}} 
                            />
                        </Col>
                        <Col lg={8} xs={12}>
                            <Card.Body className='m-1' style={{color: "#BFB5A9"}}>
                            <Card.Title style={{color: "#DB5D53"}}>{item.prodotto.nome}</Card.Title>
                            <Card.Text>Prezzo totale: <b>{item.prodotto.prezzo *item.quantita}€</b></Card.Text>
                            <Card.Text>Quantità: <b>{item.quantita}</b></Card.Text>
                            <Link className="no-decoration" to={`/info-product/${item.prodotto._id}`}>
                                <Button className="orange-color me-3">
                                Info prodotto
                                </Button>
                            </Link>
                            <Button className='remove-button'  onClick={() => removeProduct(item.prodotto._id)}>
                                Rimuovi dal carrello
                            </Button>
                            </Card.Body>
                        
                        </Col>
                        
                        </Row>
                    </Card>
                )
            })
        :
        <h3>Il carrello è vuoto</h3>
        }
        {cartData.length > 0 && 
        <Button className='cart-button' onClick={buyProducts}>Acquista</Button>}
        {isBought && <Alert variant='success'>Prodotti acquistati</Alert>}
        {isRemoved && <Alert variant='success'>Il prodotto è stato tolto dal carrello</Alert>}
        <Link to='/account'>
            <Button variant='outline-danger' className='ms-2'>←</Button>
        </Link>
    </Container>
    </>
  )
}
