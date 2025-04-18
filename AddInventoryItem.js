import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

export default function AddInventoryItem() {
  const [ingredientID, setIngredientID] = useState('');
  const [name, setName] = useState('');
  const [supplierID, setSupplierID] = useState('');
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const snapshot = await getDocs(collection(db, 'Supplier'));
      const supplierList = snapshot.docs.map(doc => doc.id);
      setSuppliers(supplierList);
    };
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const docRef = doc(db, 'InventoryItems', ingredientID);
    await setDoc(docRef, {
      ingredientID,
      name,
      supplier: supplierID
    });

    alert('Inventory item added!');
    setIngredientID('');
    setName('');
    setSupplierID('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Inventory Item</h2>
      <input
        type="text"
        placeholder="Ingredient ID"
        value={ingredientID}
        onChange={e => setIngredientID(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Ingredient Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <select value={supplierID} onChange={e => setSupplierID(e.target.value)} required>
        <option value="">Select Supplier</option>
        {suppliers.map(id => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>
      <button type="submit">Add Ingredient</button>
    </form>
  );
}