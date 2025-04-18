import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export default function AddMenuItem() {
  const [menuItem, setMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    ingredients: '',
    category: ''
  });

  const handleChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "MenuItems", menuItem.name);
    await setDoc(docRef, {
      ...menuItem,
      price: parseFloat(menuItem.price),
      ingredients: menuItem.ingredients.split(',').map(i => i.trim())
    });
    alert("Menu item added!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Menu Item</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
      <input name="ingredients" placeholder="Ingredients (comma-separated)" onChange={handleChange} />
      <input name="category" placeholder="Category" onChange={handleChange} />
      <button type="submit">Add Item</button>
    </form>
  );
}