import { useEffect, useState } from "react";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";

// ======================================================
// API BASE URL
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://yaswanth-ai-agent-2026.azurewebsites.net";

// ======================================================
// COMPONENT
// ======================================================

export default function LoginPage({
  onLogin,
  onSwitchToRegister,
  onSwitchToForgotPassword,
}) {

  // ======================================================
  // STATES
  // ======================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [useOtp, setUseOtp] =
    useState(false);

  const [
    sendingOtp,
    setSendingOtp,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  // ======================================================
  // AUTO LOGIN
  // ======================================================

  useEffect(() => {

    const savedToken =
      localStorage.getItem(
        "token"
      );

    if (
      savedToken &&
      onLogin
    ) {

      onLogin(savedToken);
    }

  }, []);

  // ======================================================
  // API HELPER
  // ======================================================

  const apiRequest = async (
    endpoint,
    method = "GET",
    body = null
  ) => {

    try {

      console.log(
        "API CALL:",
        `${API_BASE_URL}${endpoint}`
      );

      const response =
        await fetch(
          `${API_BASE_URL}${endpoint}`,
          {
            method,

            headers: {
              "Content-Type":
                "application/json",
            },

            body: body
              ? JSON.stringify(body)
              : null,
          }
        );

      let data = {};

      try {

        data =
          await response.json();

      } catch {

        data = {};
      }

      if (!response.ok) {

        throw new Error(
          data.detail ||
          data.message ||
          `Server Error (${response.status})`
        );
      }

      return data;

    } catch (error) {

      console.error(
        "API ERROR:",
        error
      );

      throw error;
    }
  };

  // ======================================================
  // SEND OTP
  // ======================================================

  const sendOtp = async () => {

    if (!email) {

      setError(
        "Please enter email"
      );

      return;
    }

    try {

      setSendingOtp(true);

      setError("");
      setSuccess("");

      const data =
        await apiRequest(
          "/api/auth/send-otp",
          "POST",
          {
            email,
          }
        );

      setOtpSent(true);

      setSuccess(
        data.message ||
        "OTP sent successfully"
      );

    } catch (err) {

      setError(
        err.message ||
        "Failed to send OTP"
      );

    } finally {

      setSendingOtp(false);
    }
  };

  // ======================================================
  // LOGIN
  // ======================================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      setLoading(true);

      let data;

      // ======================================================
      // OTP LOGIN
      // ======================================================

      if (useOtp) {

        if (!otp) {

          setError(
            "Please enter OTP"
          );

          setLoading(false);

          return;
        }

        data =
          await apiRequest(
            "/api/auth/login-otp",
            "POST",
            {
              email,
              otp,
            }
          );

      }

      // ======================================================
      // PASSWORD LOGIN
      // ======================================================

      else {

        data =
          await apiRequest(
            "/api/auth/login",
            "POST",
            {
              email,
              password,
            }
          );
      }

      console.log(
        "LOGIN SUCCESS:",
        data
      );

      // ======================================================
      // SAVE TOKEN
      // ======================================================

      if (
        data.access_token
      ) {

        localStorage.setItem(
          "token",
          data.access_token
        );

        setSuccess(
          "Login successful"
        );

        if (onLogin) {

          onLogin(
            data.access_token
          );
        }

      } else {

        setError(
          "Token not received"
        );
      }

    } catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-black flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-8 text-white text-center">

            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">

              <ShieldCheck className="w-8 h-8" />

            </div>

            <h1 className="text-3xl font-bold">
              NexSpace
            </h1>

            <p className="text-blue-100 mt-2">
              Welcome Back
            </p>

          </div>

          {/* BODY */}

          <div className="p-8">

            {/* LOGIN MODE */}

            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">

              <button
                type="button"
                onClick={() => {

                  setUseOtp(false);

                  setError("");
                  setSuccess("");
                }}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                  !useOtp
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Password
              </button>

              <button
                type="button"
                onClick={() => {

                  setUseOtp(true);

                  setError("");
                  setSuccess("");
                }}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                  useOtp
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-600"
                }`}
              >
                OTP Login
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ERROR */}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  {success}
                </div>
              )}

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                {useOtp ? (

                  <div className="flex gap-2">

                    <div className="relative flex-1">

                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(
                            e.target.value
                          )
                        }
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />

                    </div>

                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={sendingOtp}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold disabled:opacity-50"
                    >
                      {sendingOtp
                        ? "Sending..."
                        : otpSent
                        ? "Resend"
                        : "Send OTP"}
                    </button>

                  </div>

                ) : (

                  <div className="relative">

                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />

                  </div>
                )}

              </div>

              {/* OTP FIELD */}

              {useOtp && otpSent && (

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    OTP
                  </label>

                  <div className="relative">

                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                        )
                      }
                      placeholder="Enter OTP"
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                </div>
              )}

              {/* PASSWORD */}

              {!useOtp && (

                <div>

                  <div className="flex justify-between items-center mb-2">

                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={
                        onSwitchToForgotPassword
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </button>

                  </div>

                  <div className="relative">

                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="••••••••"
                      className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                  </div>

                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  loading ||
                  (useOtp &&
                    !otpSent)
                }
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3.5 rounded-xl disabled:opacity-50"
              >
                {loading
                  ? useOtp
                    ? "Verifying..."
                    : "Logging in..."
                  : useOtp
                  ? "Login with OTP"
                  : "Login"}
              </button>

            </form>

            {/* FOOTER */}

            <p className="text-center text-gray-600 mt-6 text-sm">

              Don’t have an account?{" "}

              <button
                onClick={
                  onSwitchToRegister
                }
                className="text-blue-600 font-semibold hover:underline"
              >
                Register here
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
