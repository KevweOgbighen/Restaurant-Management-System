import './App.css';
import AddMenuItem from './components/AddMenuItem';
import AddOrder from './components/AddOrder';
import AddInventoryItem from './components/AddInventoryItem';
import SearchMenu from './components/SearchMenu';
import ItemOrderCount from './components/ItemOrderCount';
import OrdersWithCustomers from './components/OrdersWithCustomers';
import CustomerRecommendations from './components/CustomerRecommendations';
import EditDeleteMenu from './components/EditDeleteMenu';

function App() {
  return (
    <div className="App">
      <header>
        <h1>🍽️ Restaurant Manager</h1>
      </header>

      <main className="container">
        <section className="card">
          <h2>Inventory Management</h2>
          <AddInventoryItem />
        </section>

        <section className="card">
          <h2>Menu Management</h2>
          <AddMenuItem />
          <EditDeleteMenu />
        </section>

        <section className="card">
          <h2>Order Management</h2>
          <AddOrder />
        </section>

        <section className="card">
          <h2>Search Menu</h2>
          <SearchMenu />
        </section>

        <section className="card">
          <h2>Menu Item Order Count</h2>
          <ItemOrderCount />
        </section>

        <section className="card">
          <h2>Customer Orders</h2>
          <OrdersWithCustomers />
        </section>

        <section className="card">
          <h2>Personalized Recommendations</h2>
          <CustomerRecommendations />
        </section>
      </main>
    </div>
  );
}

export default App;