import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { UserContext } from '../UserContextProvider';
import { Link } from 'react-router-dom';

export default function DatabaseAdmin() {
    const {token} = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:3001/admin/getUsers', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
    
          if (!response.ok) throw new Error('Errore nel recupero degli utenti');
    
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.log(error);
        }
      };

      const deleteUser = async (id) => {
        try {
          const response = await fetch(`http://localhost:3001/admin/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
    
          if (!response.ok) throw new Error('Errore nella cancellazione dell\'utente');
    
          // Aggiorna la lista degli utenti dopo l'eliminazione
          setUsers(users.filter(user => user._id !== id));
        } catch (error) {
          console.log(error);
        }
      };

      const fetchProducts = async() => {
        try {
            const response = await fetch(`http://localhost:3001/admin/products`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
            });

            if (!response.ok) throw new Error('Errore nella ricerca dei prodotti');

            const data = await response.json();
            setProducts(data);

        } catch (error) {
            
        }
      }

      const deleteProduct = async (id) => {
        try {
          const response = await fetch(`http://localhost:3001/admin/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
    
          if (!response.ok) throw new Error('Errore nella cancellazione del prodotto');
    
          // Aggiorna la lista dei prodotti dopo l'eliminazione
          setUsers(products.filter(product => product._id !== id));
        } catch (error) {
          console.log(error);
        }
      };

      useEffect(() =>{
        fetchUsers();
        fetchProducts();
      }, []);

  return (
    <Container className='my-3 text-light p-0'>
        <Table striped bordered hover variant='dark' className='my-2'>
        <thead>
        <tr>
            <th>Utenti (Username)</th>
            <th>Email</th>
            <th>Ruolo</th>
            <th>Azioni</th>
        </tr>
        </thead>
        <tbody>
        {users.map(user => (
            <tr key={user._id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.ruolo}</td>
            <td>
                <Button variant="danger" onClick={() => deleteUser(user._id)}>
                    Elimina
                </Button>
            </td>
            </tr>
        ))}
        </tbody>
    </Table>

    <Table striped bordered hover variant='dark' className='my-4'>
        <thead>
        <tr>
            <th>Nome Prodotto</th>
            <th>Prezzo</th>
            <th>Categoria</th>
            <th>Quantità</th>
            <th>Acquisti Effettuati</th>
            <th>Venditore</th>
            <th>Azioni</th>
        </tr>
        </thead>
        <tbody>
        {products.length > 0 && products.map(product => (
            <tr key={product._id}>
            <td>{product.nome}</td>
            <td>{product.prezzo}€</td>
            <td>{product.categoria}</td>
            <td>{product.quantita}</td>
            <td>{product.acquistiEffettuati}</td>
            <td>{product.venditore.username}</td>
            <td>
                <Button variant="danger" onClick={() => deleteProduct(product._id)}>
                    Elimina
                </Button>
            </td>
            </tr>
        ))}
        </tbody>
    </Table>
    <Link to="/"><Button variant='primary'>Home</Button></Link>
  </Container>
  );
};
  

