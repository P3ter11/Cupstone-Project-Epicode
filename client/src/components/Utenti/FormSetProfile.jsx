import React, { useContext, useEffect, useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { UserContext } from '../UserContextProvider';


export default function FormSetProfile({user, fetchProfile}) {
    const {token} = useContext(UserContext);
    const [selectedFile, setSelectedFile] = useState(null);

    const [success, setSuccess] = useState(false);

    const [dataProfile, setDataProfile] = useState({
        username: user.username,
        email: user.email
    });

    const handleChange = (e) =>{
        setDataProfile({...dataProfile, [e.target.name]: e.target.value});
    };

    const handleChangeFile = (e) =>{
        setSelectedFile(e.target.files[0]);
    }
    
    const handleSetProfile = async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/user/${user._id}`,{
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataProfile)
            });

            if(!response.ok)
                throw new Error("Errore nella modifica dei dati dell'utente");

            if(selectedFile)
                await changeAvatar();

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            fetchProfile();
        } catch (error) {
            console.error(error);
        }
    }

    const changeAvatar = async () =>{
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            const response = await fetch(`http://localhost:3001/user/${user._id}/avatar`,{
                method: 'PATCH',
                body: formData
            });

            if(!response.ok)
                throw new Error("Errore nell'upload dell'avatar");

        } catch (error) {
            console.error(error);
        }
    }

  return (
    <Container fluid style={{width: "50%"}} className='bg-dark text-light my-5 p-4'>
        <Form onSubmit={handleSetProfile}>
        <Form.Group controlId="formUserName" className='m-2'>
            <Form.Label>UserName / Società</Form.Label>
            <Form.Control
            type="name"
            className='rounded-0'
            name="username"
            placeholder="Inserisci una tua email"
            value={dataProfile.username}
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
            placeholder="Inserisci una nuova mail"
            value={dataProfile.email}
            onChange={handleChange}
            required
            />
        </Form.Group>

        <Form.Group controlId="formFile" className='m-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control
            type="file"
            className='rounded-0'
            name="email"
            placeholder="Inserisci una nuova mail"
            onChange={handleChangeFile}
            />
        </Form.Group>
        <Button className='cart-button m-2' type="submit">
            Effettua modifiche
        </Button>
        
        {success && <Alert variant='success' className='rounded-0 m-2'>Modifiche effettuate con successo</Alert>}
        {/* <Button className='user-button m-2' onClick={changeAvatar}>Cambia Avatar</Button> */}
        </Form>
        
    </Container>
  )
}
