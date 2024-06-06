import React, { useEffect, useState } from 'react'
import { Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Filter() {

  const categoryOptions = ["Dispositivi elettronici", "Animali domestici", "Sport", "Casa",
  "Libri", "Igiene personale", "Abbigliamento", "Auto/Moto"];

  const priceOptions = [
    { label: "< 20€", value: "<20" },
    { label: "< 50€", value: "<50" },
    { label: "< 100€", value: "<100" },
    { label: "Tra 100 e 200€", value: "100-200" },
    { label: "> 200€", value: ">200" }
  ];

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
  

    const handleCategoryChange = (e) =>{
      const category = e.target.value;
      setSelectedCategory(category);
    }

    const handlePriceChange = (e) =>{
      const price = e.target.value;
      setSelectedPrices(prev =>
        prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]
      );
    };
  

    const fetchProducts = async() =>{
      try {
          const response = await fetch("http://localhost:3001/user/products/filter",{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({categoria: selectedCategory, prezzi: selectedPrices})
          });

        if(!response.ok)
          throw new Error("Errore durante il recupero dei prodotti");

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError("Errore durante il recupero dei prodotti");
      }

    }
  

  useEffect(() =>{
    fetchProducts();
  }, [selectedCategory, selectedPrices]);

  return (
    <>
    <Container fluid style={stickyHeader} className='bg-dark'>
      <div className='px-3'>
          <h4 className='my-2'>Filtra per categoria</h4>
          <Form>
            {categoryOptions.map(item => (
              <Form.Check
                inline
                key={item}
                type="radio"
                label={item}
                value={item}
                onChange={handleCategoryChange}
                checked={selectedCategory === item}
                className='my-1'
              />
            ))}
          </Form>
          <h4 className="mt-3">Filtra per prezzo</h4>
          <Form>
            {priceOptions.map(price => (
              <Form.Check
                inline
                key={price.value}
                type="checkbox"
                label={price.label}
                value={price.value}
                onChange={handlePriceChange}
                className='my-1'
              />
            ))}
          </Form>
        </div>

    </Container>
        
    {error && <p>{error}</p>}
          <Row>
            {products.map(product => (
              <Card className='rounded-0 bg-dark text-light m-3' key={product._id}>
              <Row>
                <Col lg={4} xs={12}>
                  <Card.Img 
                    className='rounded-0'
                    src={product.immagine} 
                    alt="Product Image" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: "cover"}} 
                  />
                </Col>
                <Col lg={8} xs={12}>
                  <Card.Body className='m-1' style={{color: "#BFB5A9"}}>
                    <Card.Title>{product.nome}</Card.Title>
                    <Card.Text>Prezzo: <b>{product.prezzo}€</b></Card.Text>
                    <Link className="no-decoration" to={`/info-product/${product._id}`}>
                      <Button className="border-0 bg-light text-dark">
                        Info prodotto
                      </Button>
                    </Link>
                  </Card.Body>
                
                </Col>
                
                </Row>
              </Card>
            ))}
          </Row>
    </>
  )
}

const stickyHeader = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  borderBottom: "2px solid #BFB5A9"
}

/* const equalHeight = {
  maxHeight: "250px"
} */
