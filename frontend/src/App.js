import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";
import "./styles/admin.css";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminOrderDetails from "./pages/Admin/AdminOrderDetails";
import AdminReservations from "./pages/Admin/AdminReservations";
import AdminReservationDetails from "./pages/Admin/AdminReservationDetails";
import AdminQuestions from "./pages/Admin/AdminQuestions";
import AdminFAQ from "./pages/Admin/AdminQuestions";
import AdminFAQNew from "./pages/Admin/AdminFAQNew";
import AdminFAQEdit from "./pages/Admin/AdminFAQEdit";
import AdminCostumes from "./pages/Admin/AdminCostumes";
import AdminCostumeEdit from "./pages/Admin/AdminCostumeEdit";
import CostumesAdd from "./pages/Admin/CostumesAdd";

import Home from "./pages/Home";
import CostumesList from "./pages/CostumeList";
import CostumeDetails from "./pages/CostumeDetails";
import Cart from "./pages/cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import FAQ from "./pages/FAQ";
import AdminRoute from "./routes/AdminRoute";
import Checkout from "./pages/checkout";
import Contact from "./pages/Contact";

function Placeholder({ title }) {
  return (
    <div className="container" style={{ padding: "48px 0" }}>
      {title}
    </div>
  );
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
          <Route
            path="/how-it-works"
            element={<Placeholder title="How it works" />}
          />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetails />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="reservations/:id" element={<AdminReservationDetails />} />
              <Route path="faq" element={<AdminQuestions/>} />
              <Route path="faq/new" element={<AdminFAQNew />} />
              <Route path="faq/:id" element={<AdminFAQEdit />} />
              <Route path="costumes" element={<AdminCostumes />} />
              <Route path="costumes/add" element={<CostumesAdd />} />
              <Route path="costumes/:id" element={<AdminCostumeEdit />} />
             </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Placeholder title="404" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
