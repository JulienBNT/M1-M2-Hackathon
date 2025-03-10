// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/components/contexts/AuthContext.jsx";
// import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@/components/pages/Authentication/Login/LoginPage.jsx";
import RegisterPage from "@pages/Authentication/Register/RegisterPage.jsx";
import NotFoundPage from "@pages/error/NotFoundPage.jsx";
import Layout from "@/components/Layout/Layout.jsx";
import Home from "@pages/Home/Home.jsx";
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Route de redirection par défaut */}
          {/*<Route path="/" element={<Navigate to="/login" />} />*/}

          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes protégées */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Erreur 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
