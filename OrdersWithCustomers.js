import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function OrdersWithCustomers() {
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'CustomerOrders'));
      const results = [];

      for (const docSnap of snapshot.docs) {
        const { CustomerID, OrderID } = docSnap.data();
      
        // ⛔️ If customerID or orderID is undefined, doc() will break
        if (!CustomerID || !OrderID) continue;
      
        const customerDoc = await getDoc(doc(db, 'Customer', CustomerID));
        const orderDoc = await getDoc(doc(db, 'Order', OrderID));
      
        if (customerDoc.exists() && orderDoc.exists()) {
          results.push({
            customer: customerDoc.data(),
            order: orderDoc.data(),
            OrderID
          });
        }
      }

      setOrderDetails(results);
    };

    fetchData();
  }, []);

  return (
    <div>
      <ul>
        {orderDetails.map((entry, index) => (
          <li key={index}>
            <strong>Customer:</strong> {entry.customer.Name} ({entry.customer.Phone})<br />
            <strong>Order ID:</strong> {entry.OrderID}<br />
            <strong>Total:</strong> ${entry.order.totalPrice}<br />
            <strong>Items:</strong> {(entry.order.Items || []).join(', ')}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}