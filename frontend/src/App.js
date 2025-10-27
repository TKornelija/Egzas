import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CostumesList from "./pages/CostumeList";
import CostumeDetails from "./pages/CostumeDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";

function Placeholder({ title }) {
  return <div className="container" style={{ padding: "48px 0" }}>{title}</div>;
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/costumes" element={<CostumesList />} />
          <Route path="/how-it-works" element={<Placeholder title="How it works" />} />
          <Route path="/faq" element={<Placeholder title="FAQ" />} />
          <Route path="/contact" element={<Placeholder title="Contact" />} />

          {/* nauji */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />

          {/* kostiumo detalės */}
          <Route path="/costumes/:id" element={<CostumeDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}