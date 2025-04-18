import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

export default function EditDeleteMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    ingredients: ''
  });

  // Fetch all menu items
  useEffect(() => {
    const fetchItems = async () => {
      const snapshot = await getDocs(collection(db, 'MenuItems'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(list);
    };
    fetchItems();
  }, []);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.Name,
      description: item.Description || '',
      price: item.Price,
      category: item.Category,
      ingredients: item.Ingredients?.join(', ') || ''
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    const itemRef = doc(db, 'MenuItems', selectedItem.id);
    await updateDoc(itemRef, {
      Name: formData.name,
      Description: formData.description || '',
      Price: parseFloat(formData.price),
      Category: formData.category,
      Ingredients: formData.ingredients.split(',').map(i => i.trim())
    });

    alert('Menu item updated!');
    window.location.reload(); // Simple refresh to update list
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    await deleteDoc(doc(db, 'MenuItems', id));
    alert('Item deleted');
    window.location.reload();
  };

  return (
    <div>
      <h2>Edit or Delete Menu Items</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item.id}>
            <strong>{item.Name}</strong> - {item.Category} - ${item.Price}
            <button onClick={() => handleSelect(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px', color: 'red' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {selectedItem && (
        <div style={{ marginTop: '20px' }}>
          <h3>Edit "{selectedItem.name}"</h3>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" /><br />
          <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" /><br />
          <input name="price" value={formData.price} onChange={handleChange} type="number" placeholder="Price" /><br />
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" /><br />
          <input name="ingredients" value={formData.ingredients} onChange={handleChange} placeholder="Ingredients (comma-separated)" /><br />
          <button onClick={handleUpdate}>Update Item</button>
        </div>
      )}
    </div>
  );
}