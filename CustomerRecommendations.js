import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function CustomerRecommendations() {
  const [customerID, setCustomerID] = useState('');
  const [customers, setCustomers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch all customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      const snapshot = await getDocs(collection(db, 'Customer'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(list);
    };
    fetchCustomers();
  }, []);

  const handleRecommend = async () => {
    // Fetch all customer order mappings
    const orderMapSnap = await getDocs(collection(db, 'CustomerOrders'));

    const customerOrderIDs = orderMapSnap.docs
      .map(doc => doc.data())
      .filter(entry => entry.CustomerID === customerID)
      .map(entry => entry.OrderID);

    // Get customer's ordered items
    const customerItemsSet = new Set();
    for (const orderID of customerOrderIDs) {
      const orderSnap = await getDoc(doc(db, 'Order', orderID));
      if (orderSnap.exists()) {
        const items = orderSnap.data().Items || [];
        items.forEach(item => customerItemsSet.add(item));
      }
    }

    // Fetch all orders to calculate popularity
    const allOrdersSnap = await getDocs(collection(db, 'Order'));
    const itemCounts = {};

    allOrdersSnap.docs.forEach(order => {
      const items = order.data().Items || [];
      items.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
    });

    // Sort by popularity
    const sortedPopularItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([item]) => item);

    // Filter out items the customer already ordered
    const newRecommendations = sortedPopularItems.filter(
      item => !customerItemsSet.has(item)
    ).slice(0, 3); // top 3 only

    setRecommendations(newRecommendations);
  };

  return (
    <div>
      <select value={customerID} onChange={e => setCustomerID(e.target.value)}>
        <option value="">Select Customer</option>
        {customers.map(customer => (
          <option key={customer.id} value={customer.id}>
            {customer.name} ({customer.id})
          </option>
        ))}
      </select>
      <button onClick={handleRecommend} disabled={!customerID}>
        Get Recommendations
      </button>

      {recommendations.length > 0 && (
        <div>
          <h4>Recommended Items You Haven’t Tried:</h4>
          <ul>
            {recommendations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}