import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { getItem } from "./utils/storage";
import CadastreSe from "./pages/CadastreSe";
import Home from "./pages/Home";
import Login from "./pages/Login";

function ProtectedRoutes({ redirectTo }) {
  const token = getItem("token");
  const isAuthenticated = token;
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MainRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route path="/" element={<CadastreSe />} />
        <Route path="/cadastre-se" element={<CadastreSe />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes redirectTo="/cadastre-se" />}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default MainRoutes;
