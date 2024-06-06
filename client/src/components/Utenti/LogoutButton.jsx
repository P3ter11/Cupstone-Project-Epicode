import React, { useContext } from 'react'
import { Button } from 'react-bootstrap';
import { UserContext } from '../UserContextProvider';

export default function LogoutButton(){
    const {setToken} = useContext(UserContext);

    const handleLogout = () =>{
        setToken("");
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
    }
    
  return (
    <Button className='logout m-2' onClick={handleLogout}>Logout</Button>
  )
}
