import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, Form, Button, FormControl } from 'react-bootstrap';
import "./styles.css";
import { Link } from 'react-router-dom';
import { UserContext } from './UserContextProvider';

function MyNavbar({setSearchQuery}) {
    const {token} = useContext(UserContext);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('User');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const ruolo = user ? user.ruolo : null;

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className='m-5 px-3 py-4 nav'>
            <Container fluid>
                <Navbar.Brand href="/">MegaShop</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/account">Profilo</Nav.Link>
                        {ruolo === "user" && <Nav.Link href="/account/cart">Carrello</Nav.Link>}
                        {ruolo === "seller" && <Nav.Link href="/account/products">I tuoi prodotti</Nav.Link>}
                    </Nav>
                    <Form className="d-flex mx-2">
                        <FormControl
                            type="search"
                            placeholder="Cerca..."
                            className="me-2 rounded-0"
                            aria-label="Search"
                            onChange={handleSearchChange}
                        />
                    </Form>

                    
                    
                    {!token && <Link to="/login"><Button className='user-button'>Accedi</Button></Link>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;

