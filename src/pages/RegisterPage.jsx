import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
} from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://192.168.0.14:8000" || "https://nexspacebackend-b7d3eyc7dfdzfvda.centralindia-01.azurewebsites.net/";

export default function RegisterPage({
  onRegister,
  onSwitchToLogin,
}) {
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

      const response = await fetch(
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

  // VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError("Enter OTP");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${BASE_URL}/api/auth/verify-otp`,
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

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Invalid OTP"
        );
      }

      setOtpVerified(true);

      setSuccess(
        "Email verified successfully"
      );
    } catch (err) {
      setError(
        err.message ||
          "OTP verification failed"
      );
    }
  };

  // REGISTER
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

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
        "Please verify your email first"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Registration failed"
        );
      }

      localStorage.setItem(
        "token",
        data.access_token
      );

      onRegister(
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
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-3xl font-bold">
                Create Account
              </h1>

              <p className="text-blue-100 mt-2">
                Join NexSpace today
              </p>
            </div>
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
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

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
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={
                      sendingOtp
                    }
                    className="sm:min-w-[130px] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
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
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification Code
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
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
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 ${
                          otpVerified
                            ? "border-green-500 focus:ring-2 focus:ring-green-500"
                            : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                        }`}
                      />

                      {otpVerified && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-bold">
                          ✓
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={
                        verifyOtp
                      }
                      disabled={
                        otpVerified
                      }
                      className={`sm:min-w-[120px] px-4 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
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
                    className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
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
                    value={
                      confirmPassword
                    }
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            {/* FOOTER */}
            <p className="text-center text-gray-600 mt-6 text-sm">
              Already have an
              account?{" "}
              <button
                onClick={
                  onSwitchToLogin
                }
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
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