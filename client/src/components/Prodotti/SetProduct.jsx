import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContextProvider';
import { Modal, Button, Form } from 'react-bootstrap';

export default function SetProduct({dataProduct, fetchProducts}) {

  const {token} = useContext(UserContext);

  const [show, setShow] = useState(false);
    const [product, setProduct] = useState({
      nome: dataProduct.nome,
      prezzo: dataProduct.prezzo,
      descrizione: dataProduct.descrizione,
      categoria: dataProduct.categoria,
      immagine: dataProduct.immagine,
      quantita: dataProduct.quantita
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProduct({ ...product, [name]: value });
    };

    const fetchProduct = async () => {

      try {
        const response = await fetch(`http://localhost:3001/user/${dataProduct._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) throw new Error('Errore nel recupero del prodotto');

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    const updateProduct = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:3001/seller/${dataProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(product)
        });

        if (!response.ok) throw new Error('Errore nella modifica del prodotto');

        fetchProducts();
        setShow(false);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      fetchProduct();
    }, [dataProduct._id]);

       
  return (
    <>
      <Button variant="outline-warning" className='me-2'onClick={() => setShow(true)}>
        Modifica prodotto
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Prodotto</Modal.Title>
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
              />
            </Form.Group>

            <Form.Group controlId="formPrezzo">
              <Form.Label>Prezzo</Form.Label>
              <Form.Control
                type="number"
                name="prezzo"
                value={product.prezzo}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formDescrizione">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                name="descrizione"
                value={product.descrizione}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formCategoria">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as='select'
                name="categoria"
                value={product.categoria}
                onChange={handleInputChange}
              >
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
              />
            </Form.Group>

            <Form.Group controlId="formQuantita">
              <Form.Label>Quantità</Form.Label>
              <Form.Control
                type="number"
                name="quantita"
                value={product.quantita}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Chiudi
          </Button>
          <Button variant="success" onClick={updateProduct}>
            Salva modifiche
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
