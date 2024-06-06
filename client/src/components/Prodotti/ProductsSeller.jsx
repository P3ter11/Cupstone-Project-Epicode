import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import SetProduct from './SetProduct';
import { UserContext } from '../UserContextProvider';
import InsertProduct from './InsertProduct';
import { Link } from 'react-router-dom';

export default function ProductsSeller() {
  const {token} = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [success, setSuccess]= useState(false);

  const fetchProducts = async() =>{
    try {
      console.log("sono dentro");
      const response = await fetch('http://localhost:3001/seller/',{
        method: 'GET',
        headers: {'Authorization': `Bearer ${token}`}
      })

      if(!response.ok)
        throw new Error('Errore nella ricerca dei tuoi prodotti');

      const data = await response.json();
      setProducts(data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() =>{
    fetchProducts();
  },[]);

  const deleteProduct = async(id) =>{
    try {
     
      const response = await fetch(`http://localhost:3001/seller/${id}`,{
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`}
      })

      setSuccess(true);
      setTimeout(() => setSuccess(null), 2000);
      await fetchProducts();
    } catch (error) {
      console.log(error);
    }
  }
    
  return (
    <Container className='mx-auto my-4 bg-dark text-light p-2'>
      <h2 className='my-2'>I tuoi prodotti:</h2>
      {products.length > 0 ? products.map((product) =>{
        return (
          <Card className='rounded-0 bg-dark text-light m-3' key={product._id}>
            <Row>
              <Col lg={4} xs={12}>
                <Card.Img 
                  className='rounded-0'
                  src={product.immagine} 
                  alt="Product Image" 
                  style={{ width: '100%', maxHeight: '350px', objectFit: "cover"}} 
                />
              </Col>
              <Col lg={8} xs={12}>
                <Card.Body className='m-1' style={{color: "#BFB5A9"}}>
                  <Card.Title style={{color: "#DB5D53"}}>{product.nome}</Card.Title>
                  <Card.Text>Prezzo: <b>{product.prezzo}€</b></Card.Text>
                  <Card.Text>Categoria: <b>{product.categoria}</b></Card.Text>
                  <Card.Text>{product.descrizione}</Card.Text>
                  <Card.Text>Quantità disponibile: <b>{product.quantita}</b></Card.Text>
                  <Card.Text>Acquisti effettuati: <b>{product.acquistiEffettuati}</b></Card.Text>

                  <Card.Text>Società: <b>{product.venditore.username}</b></Card.Text>
                  <SetProduct dataProduct={product} fetchProducts={fetchProducts}/>
                  <Button variant='outline-danger' onClick={() => deleteProduct(product._id)}>
                    Elimina prodotto
                  </Button>
                  
                </Card.Body>
              
              </Col>
              
              </Row>
            </Card>
        )
      }): <p>Non hai inserito nessun prodotto</p>}
      {success && <Alert variant='success' className='m-2 rounded-0'>Prodotto eliminato</Alert>}
      <InsertProduct fetchProducts={fetchProducts}/>
      <Link to='/'><Button variant='secondary'>Home</Button></Link>
    </Container>
  )
}
