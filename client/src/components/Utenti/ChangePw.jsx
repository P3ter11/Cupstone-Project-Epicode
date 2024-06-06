import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { UserContext } from '../UserContextProvider';
import { Alert, Container, Form, Button } from 'react-bootstrap';

export default function ChangePw() {
    const {token} = useContext(UserContext);

    const [pw, setPw] = useState({
        oldPw: '',
        newPw: ''
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handlePwChange = (e) =>{
        setPw({...pw, [e.target.name]: e.target.value});
    };

    const handleChangePw = async(e)=>{
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/user/change-pw",{
                method: "PATCH",
                headers: {'Authorization': `Bearer ${token}`, 'Content-type': 'application/json'},
                body: JSON.stringify(pw)
            });

            if (!response.ok) {
                setError(true);
                return;
            }

            setSuccess(true);
            setTimeout(() => setSuccess(null), 3000);
            setPw({
                oldPw: '',
                newPw: ''
            })

        } catch (error) {
            console.error(error);
        }
    };


  return (
    <>    
    <Container fluid className='bg-dark text-light my-5 w-50 p-4'>
        <Form onSubmit={handleChangePw}>
            <Form.Group controlId="oldPw">
                <Form.Label>Vecchia Password</Form.Label>
                <Form.Control
                type="password"
                className='rounded-0'
                name="oldPw"
                placeholder="Inserisci la tua vecchia pw"
                value={pw.oldPw}
                onChange={handlePwChange}
                required
                />
            </Form.Group>

            <Form.Group controlId="oldPw">
                <Form.Label>Nuova Password</Form.Label>
                <Form.Control
                type="password"
                className='rounded-0'
                name="newPw"
                placeholder="Inserisci la nuova pw"
                value={pw.newPw}
                onChange={handlePwChange}
                required
                />
            </Form.Group>
            <Button variant='primary' type='submit' className='my-3'>Cambia password</Button>
        </Form>
        {error && <Alert variant='danger' className='rounded-0'>Errore nel cambio della password</Alert>}
        {success && <Alert variant='success' className='rounded-0'>La password è stata modificata!</Alert>}
    </Container>
        
    
    </>
  )
}
