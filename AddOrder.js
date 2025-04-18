import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function AddOrder() {
  const [customerID, setCustomerID] = useState('');
  const [items, setItems] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const snapshot = await getDocs(collection(db, 'Customer'));
      const customerList = snapshot.docs.map(doc => doc.id);
      setCustomers(customerList);
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderRef = await addDoc(collection(db, 'Order'), {
      totalPrice: parseFloat(totalPrice),
      items: items.split(',').map(item => item.trim())
    });

    await addDoc(collection(db, 'CustomerOrders'), {
      customerID,
      orderID: orderRef.id
    });

    alert("Order placed!");
    setCustomerID('');
    setItems('');
    setTotalPrice('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Place Order</h2>
      <select value={customerID} onChange={e => setCustomerID(e.target.value)} required>
        <option value="">Select Customer</option>
        {customers.map(id => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Items (comma-separated names)"
        value={items}
        onChange={e => setItems(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Total Price"
        value={totalPrice}
        onChange={e => setTotalPrice(e.target.value)}
        required
      />
      <button type="submit">Submit Order</button>
    </form>
  );
}