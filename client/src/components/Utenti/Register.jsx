import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Register() {
    const [params, setParams] = useState({
        username: '',
        email: '',
        avatar: '',
        password: '',
        ruolo: ''
    });

    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value });
      };

    const handleRegister = async (e) =>{
        e.preventDefault();

        //Se il parametro inserito è un'azienda inserisco immagine di default
        const updatedParams = {...params};

        if(params.ruolo === 'seller')
          updatedParams.avatar = 'https://res.cloudinary.com/drzpagvhc/image/upload/v1716722916/avatars/company.jpg';

        try {
            const response = await fetch(`http://localhost:3001/auth/register`,{
                method: 'POST',
                headers: { 'Content-Type': 'Application/json'},
                body: JSON.stringify(updatedParams)
            });

            if(!response.ok)
              throw new Error("Errore durante la registrazione");
                
            navigate('/login');
                

        } catch (error) {
            setError("Errore in fase di registrazione");
        }
    }

    

  return (
    <Container fluid style={{width: "50%"}} className='bg-dark text-light my-5 p-4'>
    <Form onSubmit={handleRegister}>
        <h2>Registrati</h2>

        <Form.Group controlId="formEmail" className='m-2'>
            <Form.Label>UserName / Società</Form.Label>
            <Form.Control
            type="name"
            className='rounded-0'
            name="username"
            placeholder="Inserisci Username"
            value={params.username}
            onChange={handleChange}
            required
            />
        </Form.Group>

        <Form.Group controlId="formEmail" className='m-2'>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          className='rounded-0'
          name="email"
          placeholder="Inserisci una tua email"
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
          placeholder="Inserisci una password"
          value={params.password}
          onChange={handleChange}
          required
        />
        </Form.Group>

        <Form.Group controlId="formRole" className='m-2'>
          <Form.Label className='me-5'>Ruolo</Form.Label>
          <Form.Check 
            type='radio'
            label='User'
            name='ruolo'
            value='user'
            onChange={handleChange}
            required
          />
            <Form.Check 
            type='radio'
            label='Seller'
            name='ruolo'
            value='seller'
            onChange={handleChange}
            required
            />
            <Form.Check 
            type='radio'
            label='Admin'
            name='ruolo'
            value='admin'
            onChange={handleChange}

            />

        </Form.Group>

      <Button type="submit" className='m-2 orange-color'>
        Registrati
      </Button>

        <Link to="/login">
            <Button type="submit" className='m-2 user-button'>Accedi</Button>
        </Link>
        <Link to="/">
            <Button variant="outline-secondary" type="submit" className='m-2'>Torna alla Home</Button>
        </Link>
        
      {error && <Alert variant='danger' className='m-2'>{error}</Alert>}
    </Form>
    </Container>
  )
}

