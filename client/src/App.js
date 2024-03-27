import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/pages/Register";
import "./App.css";
import Home from "./components/pages/Home";
import ProtectRoute from "./utils/ProtectRoute";
import Login from "./components/pages/Login";
import Activation from "./components/pages/Activation";
import ProfilePage from "./components/pages/ProfilePage";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
 import ProfilePictureManagement from "./components/pages/ProfilePictureManagement";
import AdminLogin from "./components/admin/pages/AdminLogin";
import AdminDashboard from "./components/admin/pages/AdminDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePictureManagement />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route
          path="/login/activate/:activationToken"
          element={<Activation />}
        />
        <Route path="/login" element={<Login />} />
        <Route path='/admin/login'  element={<AdminLogin />}/>
        
        
        <Route path='/admin/dashboard'  element={<AdminDashboard />}/>
        


        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
