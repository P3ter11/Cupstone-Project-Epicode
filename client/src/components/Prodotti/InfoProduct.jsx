import React, { useContext, useEffect, useState } from 'react';
import {Card, Row, Col, Button, Container, Alert} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CommentArea from './CommentArea';
import { UserContext } from '../UserContextProvider';
import { Link } from 'react-router-dom';

export default function InfoProduct() {
    const {productId} = useParams();
    const [reviews, setReviews] = useState([]);
    const [product, setProduct] = useState([]);
    const {token} = useContext(UserContext);

    const [isAdd, setIsAdd] = useState(null);
     

    //Mi ritorna tutti i commenti del prodotto
    const fetchReviews = async() =>{
        try {
            const response = await fetch(`http://localhost:3001/user/${productId}/reviews`);
            if(!response.ok)
              throw new Error('Errore nella gestione dei commenti');
            
            const data = await response.json();
            setReviews(data);
            console.log(data);
        } catch (error) {
            throw new Error("Errore nel get dei commenti");
        }
    }

    //Mi ritorna tutti i dati del prodotto
    const fetchProduct = async() =>{
      try {
        const response = await fetch(`http://localhost:3001/user/${productId}`);
        if(!response.ok)
          throw new Error('Errore nella get del prodotto');

        const data = await response.json();
        setProduct(data);

      } catch (error) {
        throw new Error('Errore nella get del prodotto');
      }
    }

    useEffect(() =>{
      fetchReviews();
      fetchProduct();
    }, [productId]);

    //Creazione delle stelle
    const renderStars = (valutazione) => {
      return Array.from({ length: valutazione }, (_, index) => (
          <span key={index} style={{ color: 'gold' }}>★</span>
      ));
    };

    //Aggiungo al carrello 1 prodotto
    const addToCart = async() =>{
      try {
        const response = await fetch(`http://localhost:3001/user/addProduct/${productId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'Application/json'},
          body: JSON.stringify({quantita: 1})
        });

        if(!response.ok)
          throw new Error("Errore nell'inserimento del prodotto nel carrello");

        setIsAdd(true);
        setTimeout(() => setIsAdd(null), 3000);
      } catch (error) {
        setIsAdd(false);
        setTimeout(() => setIsAdd(null), 3000);
      }
    }

    return (
      <>
      <Container fluid style={{width: "95%"}}>
        <Card className='rounded-0 bg-dark text-light m-3'>
          <Row>
            <Col lg={4} xs={12}>
              <Card.Img 
                className='rounded-0'
                src={product.immagine} 
                alt="Product Image" 
                style={{ width: '100%', height: '100%', objectFit: "cover"}} 
              />
            </Col>
            <Col lg={8} xs={12}>
              <Card.Body className='m-1' style={{color: "#BFB5A9"}}>
                <Card.Title style={{color: "#DB5D53"}}>{product.nome}</Card.Title>
                <Card.Text>Prezzo: <b>{product.prezzo}€</b></Card.Text>
                <Card.Text>{product.descrizione}</Card.Text>
                <Card.Text>Categoria: <b>{product.categoria}</b></Card.Text>
                <Card.Text>Quantità disponibile: <b>{product.quantita}</b></Card.Text>
                <Card.Text>Acquisti effettuati: <b>{product.acquistiEffettuati}</b></Card.Text>
                <Card.Text>Società: <b>{product.venditore?.username}</b></Card.Text>

                <Button className='cart-button mb-4' onClick={addToCart}>Aggiungi al carrello</Button>

                <h6 style={{color: "#DB5D53"}}>Recensioni:</h6>    
                <Container fluid className='my-1 p-2 scroll-bar' style={containerComments}>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      
                      <div key={review._id} style={{lineHeight: "10px", marginBottom: "30px"}}>
                        <p><b>{review.utente?.username || "Anonimo"}</b> {renderStars(review.valutazione)}</p>
                        <p>{review.commento}</p>
                        
                      </div>
                      
                    )

                  )):(
                    <p>Non è stata scritta alcuna recensione</p>
                  )}

                </Container>
                {token !=='' ? <CommentArea fetchReviews={fetchReviews}/> : <Link to="/login"><Button className='user-button my-3'>Accedi per pubblicare recensioni</Button></Link>}
              </Card.Body>

              {isAdd === true && <Alert variant="success" className='rounded-0 m-2'>Prodotto inserito nel carrello</Alert>}
              {isAdd === false && <Alert variant="danger" className='rounded-0 m-2'>Solo gli utenti USER possono inserire i prodotti al carrello</Alert>}

            </Col>
            
            
          </Row>
        </Card>

        
      </Container>
      
      </>
    )
}

const containerComments = {
  border: "1px solid #BFB5A9",
  overflowY: "auto",
  maxHeight: "150px"
}
