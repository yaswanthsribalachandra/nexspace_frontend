import { useState } from "react";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
} from "lucide-react";

// ======================================================
// BASE URL
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://yaswanth-ai-agent-2026.azurewebsites.net";

// ======================================================
// COMPONENT
// ======================================================

export default function RegisterPage({
  onRegister,
  onSwitchToLogin,
}) {

  // ======================================================
  // STATES
  // ======================================================

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [
    otpVerified,
    setOtpVerified,
  ] = useState(false);

  const [
    sendingOtp,
    setSendingOtp,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // ======================================================
  // API HELPER
  // ======================================================

  const apiRequest = async (
    endpoint,
    method = "GET",
    body = null
  ) => {

    try {

      const response = await fetch(
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
  // VERIFY OTP
  // ======================================================

  const verifyOtp = async () => {

    if (!otp) {

      setError("Enter OTP");

      return;
    }

    try {

      setError("");
      setSuccess("");

      const data =
        await apiRequest(
          "/api/auth/verify-otp",
          "POST",
          {
            email,
            otp,
          }
        );

      setOtpVerified(true);

      setSuccess(
        data.message ||
        "OTP verified successfully"
      );

    } catch (err) {

      setError(
        err.message ||
        "OTP verification failed"
      );
    }
  };

  // ======================================================
  // REGISTER
  // ======================================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // ======================================================
    // VALIDATIONS
    // ======================================================

    if (!fullName.trim()) {

      setError(
        "Full name required"
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match"
      );

      return;
    }

    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters"
      );

      return;
    }

    if (!otpVerified) {

      setError(
        "Please verify email first"
      );

      return;
    }

    // ======================================================
    // REGISTER API
    // ======================================================

    try {

      setLoading(true);

      const data =
        await apiRequest(
          "/api/auth/register",
          "POST",
          {
            full_name: fullName,
            email,
            password,
          }
        );

      console.log(
        "REGISTER SUCCESS:",
        data
      );

      // ======================================================
      // STORE TOKEN
      // ======================================================

      if (
        data.access_token
      ) {

        localStorage.setItem(
          "token",
          data.access_token
        );

        setSuccess(
          "Registration successful"
        );

        if (onRegister) {

          onRegister(
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
        "REGISTER ERROR:",
        err
      );

      setError(
        err.message ||
        "Registration failed"
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
              Create Account
            </h1>

            <p className="text-blue-100 mt-2">
              Join NexSpace today
            </p>

          </div>

          {/* FORM */}

          <div className="p-8">

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

              {/* FULL NAME */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
                    placeholder="User Name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

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

              </div>

              {/* OTP */}

              {otpSent && (

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    OTP
                  </label>

                  <div className="flex gap-2">

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                        )
                      }
                      placeholder="Enter OTP"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={verifyOtp}
                      disabled={otpVerified}
                      className={`px-4 py-3 rounded-xl text-white font-semibold ${
                        otpVerified
                          ? "bg-green-500"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {otpVerified
                        ? "Verified"
                        : "Verify"}
                    </button>

                  </div>

                </div>
              )}

              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

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

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
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
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !otpVerified
                }
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3.5 rounded-xl disabled:opacity-50"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

            {/* FOOTER */}

            <p className="text-center text-gray-600 mt-6 text-sm">

              Already have an account?{" "}

              <button
                onClick={
                  onSwitchToLogin
                }
                className="text-blue-600 font-semibold hover:underline"
              >
                Login here
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
