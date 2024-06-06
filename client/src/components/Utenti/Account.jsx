import React, { useContext, useEffect, useState } from 'react'
import { Container, Button, Alert} from 'react-bootstrap';
import LogoutButton from './LogoutButton';
import { UserContext } from '../UserContextProvider';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import FormSetProfile from './FormSetProfile';
import ChangePw from './ChangePw';
import { useNavigate } from 'react-router-dom';

export default function Account() {
    const [userData, setUserData] = useState('');

    const {token, setToken} = useContext(UserContext);

    const navigate = useNavigate();

    const [profile, setProfile] = useState(false);

    const [showContainerPw, setShowContainerPw] = useState(false);

    const [error, setError] = useState(false);



    
    const fetchData = async() => {
        try {
            const response = await fetch(`http://localhost:3001/auth/me`,{
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`}
            });
            if(!response.ok)
                throw new Error("Errore nella ricerca dei dati dell'utente");

            const data = await response.json();
            setUserData(data);

        } catch (error) {
            console.log(error);
            setError("Errore nella ricerca dei dati dell'utente");
        }
    }

    const deleteUser = async() =>{
        try {
            const response = await fetch(`http://localhost:3001/user/${userData._id}`,{
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`}
            });

            if(!response.ok)
                throw new Error("Errore nella cancellazione dell'utente");

            localStorage.removeItem('Token');
            localStorage.removeItem('User');
            setToken('');
            navigate("/");

        } catch (error) {
            console.log(error);
            setError("Errore nella cancellazione dei dati dell'utente");
        }
    }

    useEffect(()=>{
        fetchData();
    },[]);

    
  return (
    <>
        <Container fluid style={{width: "70%"}} className='bg-dark text-light my-5 p-4'>
            <h1 className='text-center'>Account</h1>
            <p><b>Username</b>: {userData.username}</p>
            <p><b>Email</b>: {userData.email}</p>
            <p><b>Avatar</b>:
                {userData.avatar? 
                <img src={userData.avatar} alt="avatar" className='mx-5' style={{width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover"}}/>
                 : "Non hai caricato un avatar"}
            </p>
            <p><b>Roulo</b>: {userData.ruolo}</p>
            <Link to="/account/cart">
                <Button className='user-button m-2'>Visualizza carrello</Button>
            </Link>
            <Button className='user-button m-2' onClick={() => setProfile(true)}>Modifica profilo</Button>
            <Button variant='outline-primary m-2' onClick={() =>setShowContainerPw(true)}>
                Cambia password
            </Button>
            <Link to="/">
                <Button variant='outline-secondary' className='m-2'>Torna alla ⌂</Button>
            </Link>   
            <LogoutButton/>
            <Button variant='outline-danger' onClick={deleteUser}>Elimina account</Button>
        </Container>

            {showContainerPw && <ChangePw fetchProfile={fetchData}/>}
            {profile && <FormSetProfile user={userData} fetchProfile={fetchData}/>}
            {error && <Alert variant='danger' className='rounded-0 mx-auto w-50'>{error}</Alert>}
        
    </>
  )
}
