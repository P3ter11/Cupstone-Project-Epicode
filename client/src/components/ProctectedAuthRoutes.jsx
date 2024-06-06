import React, { useContext } from 'react'
import { UserContext } from './UserContextProvider';
import { Outlet, Navigate } from 'react-router-dom';

export default function ProtectedAuthRoutes() {
    const {authenticated, token} = useContext(UserContext);
    
  return authenticated ? <Outlet/> : <Navigate to="/login"/>
  
}