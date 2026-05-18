import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://yaswanth-ai-agent-2026.azurewebsites.net/docs";

export default function LoginPage({
  onLogin,
  onSwitchToRegister,
  onSwitchToForgotPassword,
}) {
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

  // AUTO LOGIN AFTER REFRESH
  useEffect(() => {

    const savedToken =
      localStorage.getItem(
        "token"
      );

    if (savedToken) {
      onLogin(savedToken);
    }

  }, []);

  // SEND OTP
  const sendOtp = async () => {

    if (!email) {
      setError(
        "Please enter your email"
      );

      return;
    }

    try {

      setSendingOtp(true);
      setError("");
      setSuccess("");

      const response =
        await fetch(
          `${BASE_URL}/api/auth/send-otp`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to send OTP"
        );
      }

      setOtpSent(true);

      setSuccess(
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

  // LOGIN
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {

      let response;

      // OTP LOGIN
      if (useOtp) {

        response = await fetch(
          `${BASE_URL}/api/auth/login-otp`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              otp,
            }),
          }
        );

      }

      // PASSWORD LOGIN
      else {

        response = await fetch(
          `${BASE_URL}/api/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Login failed"
        );
      }

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.access_token
      );

      // LOGIN USER
      onLogin(
        data.access_token
      );

    } catch (err) {

      setError(
        err.message ||
          "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-black flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-8 text-white text-center relative overflow-hidden">

            <div className="absolute inset-0 opacity-10">

              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full"></div>

              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full"></div>

            </div>

            <div className="relative z-10">

              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-4 border border-white/20">

                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>

              </div>

              <h1 className="text-3xl font-bold">
                NexSpace
              </h1>

              <p className="text-blue-100 mt-2">
                Welcome back
              </p>

            </div>
          </div>

          {/* FORM */}
          <div className="p-8">

            {/* LOGIN MODE SWITCH */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">

              <button
                type="button"
                onClick={() => {
                  setUseOtp(false);
                  setError("");
                  setSuccess("");
                }}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
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
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
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
                  <div className="flex flex-col sm:flex-row gap-2">

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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                        required
                      />

                    </div>

                    <button
                      type="button"
                      onClick={
                        sendOtp
                      }
                      disabled={
                        sendingOtp
                      }
                      className="sm:min-w-[120px] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
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
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      required
                    />

                  </div>
                )}
              </div>

              {/* OTP FIELD */}
              {useOtp && otpSent && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification Code
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
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      required
                    />

                  </div>
                </div>
              )}

              {/* PASSWORD FIELD */}
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
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
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
                      className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
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

              Don't have an
              account?{" "}

              <button
                onClick={
                  onSwitchToRegister
                }
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
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
