import { Routes, Route, NavLink } from 'react-router-dom';
import RoomService from './pages/RoomService';
import Checklist from './pages/Checklist';
import Transfers from './pages/Transfers';
import Stock from './pages/StockPage';
import Mixology from './pages/Mixology';
import Orders from './pages/Orders';

export default function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<RoomService />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/mixology" element={<Mixology />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <footer className="navbar">
        <NavLink to="/">Room</NavLink>
        <NavLink to="/checklist">Checklist</NavLink>
        <NavLink to="/transfers">Transfers</NavLink>
        <NavLink to="/stock">Stock</NavLink>
        <NavLink to="/mixology">Mixology</NavLink>
        <NavLink to="/orders">Orders</NavLink>
      </footer>
    </div>
  );
}
