import React from 'react'
import { useContext, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../UserContextProvider';


export default function InsertProduct({fetchProducts}) {
    const {token} = useContext(UserContext);

    const [show, setShow] = useState(false);
    const [product, setProduct] = useState({
        nome: '',
        prezzo: '',
        descrizione: '',
        categoria: '',
        immagine: '',
        quantita: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProduct({ ...product, [name]: value });
      console.log(e);
    };

    const addProduct = async(e) =>{
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/seller/`,{
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(product)
            });
            if(!response.ok)
                throw new Error("Errore nell'inserimento di un nuovo prodotto");

            fetchProducts();
            const data = await response.json();
            console.log(data);
            setShow(false);

        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
        <Button className='user-button m-2' onClick={() => setShow(true)}>
        Inserisci prodotto
        </Button>

        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Inserisci Prodotto</Modal.Title>
        </Modal.Header>
        <Modal.Body >
            <Form>
            <Form.Group controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                type="text"
                name="nome"
                value={product.nome}
                onChange={handleInputChange}
                className='rounded-0'
                required
                />
            </Form.Group>

            <Form.Group controlId="formPrezzo">
                <Form.Label>Prezzo</Form.Label>
                <Form.Control
                type="number"
                name="prezzo"
                value={product.prezzo}
                onChange={handleInputChange}
                required
                />
            </Form.Group>

            <Form.Group controlId="formDescrizione">
                <Form.Label>Descrizione</Form.Label>
                <Form.Control
                as="textarea"
                name="descrizione"
                value={product.descrizione}
                onChange={handleInputChange}
                required
                />
            </Form.Group>

            <Form.Group controlId="formCategoria">
                <Form.Label>Categoria</Form.Label>
                <Form.Control
                as='select'
                name="categoria"
                value={product.categoria}
                onChange={handleInputChange}
                required
                >
                    <option value="">Seleziona categoria</option>
                    <option value="Dispositivi elettronici">Dispositivi elettronici</option>
                    <option value="Animali domestici">Animali domestici</option>
                    <option value="Sport">Sport</option>
                    <option value="Casa">Casa</option>
                    <option value="Libri">Libri</option>
                    <option value="Igiene personale">Igiene personale</option>
                    <option value="Abbigliamento">Abbigliamento</option>
                    <option value="Auto/Moto">Auto/Moto</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="formImmagine">
                <Form.Label>Immagine</Form.Label>
                <Form.Control
                type="text"
                name="immagine"
                value={product.immagine}
                onChange={handleInputChange}
                required
                />
            </Form.Group>

            <Form.Group controlId="formQuantita">
                <Form.Label>Quantità</Form.Label>
                <Form.Control
                type="number"
                name="quantita"
                value={product.quantita}
                onChange={handleInputChange}
                required
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
            Chiudi
            </Button>
            <Button variant="success" onClick={addProduct}>
            Inserisci
            </Button>
        </Modal.Footer>
        </Modal>
    </>
  )
}
