import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContextProvider';

export default function Login() {
    const [params, setParams] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value });
      };

    const {token, setToken, setUserData, userData} = useContext(UserContext);

    const handleSubmit = async (e) =>{

        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'Application/json'},
                body: JSON.stringify(params)
            });

            if(!response.ok)
              throw new Error("Errore durante l'accesso");


            const data = await response.json();
            localStorage.setItem('Token', data.token);
            setToken(data.token); 
            setUserData(data.user);
            localStorage.setItem('User', JSON.stringify(data.user));
            navigate("/");

                
        } catch (error) {
            console.error("Errore durante l'accesso");
            setError("Credenziali non valide! Riprova");
        }
    }

    useEffect(() => {
        if (token !== "") navigate("/");
      }, [token]);


  return (
    <Container fluid style={{width: "50%"}} className='bg-dark text-light my-5 p-4'>
    <Form onSubmit={handleSubmit}>
        <h2>Accedi</h2>
      <Form.Group controlId="formEmail" className='m-2'>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          className='rounded-0'
          name="email"
          placeholder="Inserisci la tua email"
          value={params.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formPassword" className='m-2'>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          className='rounded-0'
          name="password"
          placeholder="Inserisci la tua password"
          value={params.password}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button type="submit" className='m-2 orange-color'>
        Accedi
      </Button>

        <Link to="/register">
            <Button type="submit" className='m-2 user-button'>Registrati</Button>
        </Link>
        <Link to="/">
            <Button variant="outline-secondary" type="submit" className='m-2'>Torna alla Home</Button>
        </Link>
        
      {error && <Alert variant='danger' className='m-2 rounded-0'>{error}</Alert>}
    </Form>
    </Container>
  )
}
