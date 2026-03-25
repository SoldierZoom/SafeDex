import './App.css'
import AppLayout from './layout/Layout'
import Content from './Content'
import React, { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AccessibilityProvider } from './context/AccessibilityContext'

export default function App() {

  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = localStorage.getItem('safedex-favourites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  //syncs to local storage if favourites change
  useEffect(() => {
    localStorage.setItem('safedex-favourites', JSON.stringify(favourites));
  }, [favourites])

  const addFavourite = (property) => {
    setFavourites((prev) => {
      const exists = prev.find((p) => p.id === property.id);
      if (exists) return prev;
      return [...prev, property];
    });
  };

  const deleteFavourite = (id) => {
    setFavourites ((prev) =>
    prev.filter((p) => p.id !== id)
  );
  };

  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AppLayout>
          <Content 
          favourites = {favourites}
          addFavourite = {addFavourite}
          onDeleteFavourite = {deleteFavourite}
         />
        </AppLayout>
      </AccessibilityProvider>
    </BrowserRouter>
  )
}
