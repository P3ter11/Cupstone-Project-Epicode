import React from 'react';
import DataProducts from '../Prodotti/DataProducts';
import { Container, Col, Row } from 'react-bootstrap';
import Filter from '../Prodotti/Filter';
import InfoBar from '../Utenti/InfoBar';

export default function Home({searchQuery}) {
  return (
    <Container fluid style={{width: "95%"}}>
      
      <div className="bg-dark d-flex" style={userBar}>
          <InfoBar/>
        </div> 
        
      <Row className="g-4 h-100">  
        <Col lg={7} md={12}>
          <Container fluid className="scroll-bar bg-dark" style={defaultContainers}>
          <h2 className='text-light bg-dark w-100 p-3' style={stickyHeader}>Ultimi prodotti inseriti:</h2>
          <DataProducts searchQuery={searchQuery}/>
          </Container>
        </Col>
        <Col lg={5} md={12}>
        
          <Container fluid className="scroll-bar bg-dark d-flex text-light px-0" style={defaultContainers}>
            <Filter/>
          </Container>
        </Col>
      </Row>
    </Container>
  )
}

const stickyHeader = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: "2px solid #BFB5A9"
  }
  
  const defaultContainers = {
    height: '65vh',
    overflowY: "auto",
    overflowX: "hidden",
    position: "realtive",
    flexDirection: "column"
  }

  const userBar ={
    height: "10vh",
    marginBottom: "20px"
  }
