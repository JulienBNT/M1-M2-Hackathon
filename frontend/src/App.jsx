import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/contexts/AuthContext.jsx";
import LoginPage from "@/components/pages/Authentication/Login/LoginPage.jsx";
import RegisterPage from "@pages/Authentication/Register/RegisterPage.jsx";
import NotFoundPage from "@pages/error/NotFoundPage.jsx";
import Layout from "@/components/Layout/Layout.jsx";
import Home from "@pages/Home/Home.jsx";
import ProtectedRoute from "@common/ProtectedRoute.jsx";

// Importation des composants de profil
import ProfileLayout from "@pages/Profil/ProfilePage.jsx";
import MyPosts from "@pages/Profil/MyPosts.jsx";
import SavedPosts from "@pages/Profil/SavedPosts.jsx";
import ProfileSettings from "@pages/Profil/ProfileSettings.jsx";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />

              {/* Routes du profil */}
              <Route path="profile" element={<ProfileLayout />}>
                <Route index element={<MyPosts />} />
                <Route path="saved" element={<SavedPosts />} />
                <Route path="settings" element={<ProfileSettings />} />
              </Route>
            </Route>
          </Route>

          {/* Erreur 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
