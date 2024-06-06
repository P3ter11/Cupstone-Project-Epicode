import React, { useEffect, useState } from 'react'
import { Button, Card, Row, Col } from 'react-bootstrap';
import {Link} from "react-router-dom";
import "../styles.css";

export default function DataProducts({searchQuery}) {

  const [products, setProducts] = useState([]);

  const fetchProduct = async() =>{
    try {
      const response = await fetch("http://localhost:3001/user/products");
      if(!response.ok){
        throw new Error("Errore durante il recupero dei prodotti");
      }

      const data = await response.json();
        setProducts(data);
      
    } catch (error) {
      console.error("Errore durante il recupero dei prodotti",error);
    }
  }

  useEffect(() =>{
    fetchProduct();
  }, []);

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className='border-border-light'>
      {filteredProducts.map((product) =>{
        return (
          <Card className='rounded-0 bg-dark text-light m-3' key={product._id}>
            <Row>
              <Col lg={4} xs={12}>
                <Card.Img 
                  className='rounded-0'
                  src={product.immagine} 
                  alt="Product Image" 
                  style={{ maxHeight: '300px', width: '100%', objectFit: "cover"}} 
                />
              </Col>
              <Col lg={8} xs={12}>
                <Card.Body className='m-1' style={{color: "#BFB5A9"}}>
                  <Card.Title style={{color: "#DB5D53"}}>{product.nome}</Card.Title>
                  <Card.Text>Prezzo: <b>{product.prezzo}€</b></Card.Text>
                  <Card.Text>{product.descrizione}</Card.Text>
                  <Card.Text>Quantità disponibile: <b>{product.quantita}</b></Card.Text>
                  <Card.Text>Società: <b>{product.venditore.username}</b></Card.Text>
                  <Link className="no-decoration" to={`/info-product/${product._id}`}>
                    <Button className="orange-color">
                      Info prodotto
                    </Button>
                  </Link>
                </Card.Body>
              
              </Col>
              
              </Row>
            </Card>
        )
      })}
    </div>
  )
}
