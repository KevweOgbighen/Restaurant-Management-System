import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ItemOrderCount() {
  const [menuItem, setMenuItem] = useState('');
  const [count, setCount] = useState(null);

  const handleCount = async () => {
    const snapshot = await getDocs(collection(db, 'Order'));
    let total = 0;

    snapshot.forEach(doc => {
      const items = doc.data().Items || [];
      total += items.filter(i => i.toLowerCase() === menuItem.toLowerCase()).length;
    });

    setCount(total);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter menu item name"
        value={menuItem}
        onChange={e => setMenuItem(e.target.value)}
      />
      <button onClick={handleCount}>Get Order Count</button>
      {count !== null && <p>{menuItem} was ordered {count} time(s).</p>}
    </div>
  );
}