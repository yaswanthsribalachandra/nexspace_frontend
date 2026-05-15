import { useState, useEffect } from "react";

import { apiClient } from "./api/client";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] =
    useState("login");

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // CHECK AUTH
  // ======================================================
  useEffect(() => {
    const checkAuth = async () => {
      const token =
        localStorage.getItem("token");

      if (token) {
        try {
          await apiClient.getMe();

          setCurrentPage(
            "dashboard"
          );
        } catch {
          localStorage.removeItem(
            "token"
          );

          setCurrentPage(
            "login"
          );
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // ======================================================
  // LOGIN
  // ======================================================
  const handleLogin = (
    token
  ) => {
    localStorage.setItem(
      "token",
      token
    );

    setCurrentPage(
      "dashboard"
    );
  };

  // ======================================================
  // LOGOUT
  // ======================================================
  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    setCurrentPage(
      "login"
    );
  };

  // ======================================================
  // LOADING SCREEN
  // ======================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-white text-lg">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // APP ROUTES
  // ======================================================
  return (
    <>
      {/* LOGIN PAGE */}
      {currentPage === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToRegister={() =>
            setCurrentPage(
              "register"
            )
          }
          onSwitchToForgotPassword={() =>
            setCurrentPage(
              "forgot"
            )
          }
        />
      )}

      {/* REGISTER PAGE */}
      {currentPage === "register" && (
        <RegisterPage
          onRegister={handleLogin}
          onSwitchToLogin={() =>
            setCurrentPage(
              "login"
            )
          }
        />
      )}

      {/* FORGOT PASSWORD PAGE */}
      {currentPage === "forgot" && (
        <ForgotPasswordPage
          onBackToLogin={() => {
            setCurrentPage(
              "login"
            );
          }}
        />
      )}

      {/* DASHBOARD PAGE */}
      {currentPage === "dashboard" && (
        <DashboardPage
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;