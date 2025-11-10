import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import CostumesList from "./pages/CostumeList";
import CostumeDetails from "./pages/CostumeDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import FAQ from "./pages/FAQ";

import AdminLogin from "./pages/AdminLogin";
import AdminEmpty from "./pages/AdminEmpty";
import AdminRoute from "./routes/AdminRoute";

function Placeholder({ title }) {
  return <div className="container" style={{ padding: "48px 0" }}>{title}</div>;
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          {/* Public / user */}
          <Route path="/" element={<Home />} />
          <Route path="/costumes" element={<CostumesList />} />
          <Route path="/costumes/:id" element={<CostumeDetails />} />
          <Route path="/how-it-works" element={<Placeholder title="How it works" />} />
          <Route path="/faq" element={<FAQ/>} />
          <Route path="/contact" element={<Placeholder title="Contact" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminEmpty />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Placeholder title="404" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
