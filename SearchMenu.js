import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function SearchMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState({
    name: '',
    category: '',
    ingredient: ''
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      const snapshot = await getDocs(collection(db, 'MenuItems'));
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
      setFilteredItems(items);
    };
    fetchMenuItems();
  }, []);

  const handleChange = (e) => {
    const updatedSearch = {
      ...search,
      [e.target.name]: e.target.value.toLowerCase()
    };
    setSearch(updatedSearch);
  
    const filtered = menuItems.filter(item => {
      const nameMatch =
        !updatedSearch.name ||
        item.Name?.toLowerCase().includes(updatedSearch.name);
  
      const categoryMatch =
        !updatedSearch.category ||
        item.Category?.toLowerCase().includes(updatedSearch.category);
  
      const ingredients = item.Ingredients?.map(i => i.toLowerCase()) || [];
      const ingredientMatch =
        !updatedSearch.ingredient ||
        ingredients.some(i => i.includes(updatedSearch.ingredient));
  
      return nameMatch && categoryMatch && ingredientMatch;
    });
  
    setFilteredItems(filtered);
  };
  
  return (
    <div>
      <input
        type="text"
        placeholder="Search by name"
        name="name"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Search by category"
        name="category"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Search by ingredient"
        name="ingredient"
        onChange={handleChange}
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            <strong>{item.Name}</strong> - {item.Category} - ${item.Price} <br />
            Ingredients: {(item.Ingredients || []).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}