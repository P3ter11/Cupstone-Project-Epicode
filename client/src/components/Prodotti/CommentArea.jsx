import React, { useState, useContext } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import "../styles.css";
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContextProvider';
import "../styles.css"

export default function CommentArea({fetchReviews}) {
    const {productId} = useParams();
    const {token} = useContext(UserContext);

    const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem('User');
      return storedUser ? JSON.parse(storedUser) : null;
    });

    const ruolo = user ? user.ruolo : null;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [comment, setComment] = useState({
      valutazione: '',
      commento: ''
    });

    const handleChange = (e) => {
      setComment({ ...comment, [e.target.name]: e.target.value });
    };

    const handleComment = async(e) =>{
      e.preventDefault();
      console.log("sono dentro");
      try {
        const response = await fetch(`http://localhost:3001/user/addReview/${productId}`,{
          method: "POST",
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'Application/json'},
            body: JSON.stringify(comment)
        });
        
        if(!response.ok)
          throw new Error("Errore nell'invio del commento");

        
        fetchReviews();
        handleClose();
      } catch (error) {
        throw new Error("Errore nell'invio del commento");
      }
    }
  
    return (
      <>
      {ruolo === 'user' &&
        <Button className='orange-color my-3' onClick={handleShow}>
          Lascia una recensione
        </Button>
      }
  
        
        <Modal show={show} onHide={handleClose} className='border border-dark rounded-0'>
          <Modal.Header closeButton style={{backgroundColor: "#BFB5A9"}}>
            <Modal.Title>Lascia una recensione</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{backgroundColor: "#BFB5A9"}}>
            <Form onSubmit={handleComment}>
            <Form.Group>
              <Form.Control 
                type="number" 
                min="1" max="5"
                name="valutazione"
                value={comment.valutazione} 
                onChange={handleChange} 
                className='bg-secondary text-light my-2 custom-placeholder'
                placeholder='Dai una valutazione da 1 a 5'
              />
              <Form.Control 
                as="textarea" 
                rows={3} 
                onChange={handleChange} 
                name="commento"
                value={comment.commento} 
                className='bg-secondary text-light custom-placeholder'
                placeholder='Scrivi qui la tua recensione'
              />
            </Form.Group>
              <Modal.Footer style={{backgroundColor: "#BFB5A9"}}>
                <Button variant="secondary" onClick={handleClose}>
                  Chiudi
                </Button>
                <Button className='orange-color' type="submit">
                  Invia
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
         
        </Modal>
      </>
    );
  }
