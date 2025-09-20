import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { serverUrl, setUserData } = useContext(userDataContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Basic frontend password check
    if (password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters long" });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setUserData(response.data);
      setLoading(false);

      // Redirect to homepage/dashboard after signup
      navigate("/customize");
    } catch (error) {
      setLoading(false);
      setUserData(null);

      if (error.response && error.response.data) {
        setErrors(error.response.data); // Backend sends { field: message } or { general: message }
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-[90%] h-[600px] px-[20px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]"
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* Name input */}
        <input
          required
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter your Name"
          className={`w-full h-[60px] outline-none border-2 ${
            errors.name ? "border-red-500" : "border-white"
          } bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        {/* Email input */}
        <input
          required
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your Email"
          className={`w-full h-[60px] outline-none border-2 ${
            errors.email ? "border-red-500" : "border-white"
          } bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        {/* Password input */}
        <div
          className={`w-full h-[60px] relative border-2 ${
            errors.password ? "border-red-500" : "border-white"
          } bg-transparent text-white rounded-full text-[18px]`}
        >
          <input
            required
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full outline-none rounded-full bg-transparent placeholder-gray-300 px-[20px] py-[10px]"
          />
          {!showPassword ? (
            <IoEye
              onClick={() => setShowPassword(true)}
              className="absolute top-[18px] cursor-pointer right-[20px] text-white w-[25px] h-[25px]"
            />
          ) : (
            <IoEyeOff
              onClick={() => setShowPassword(false)}
              className="absolute top-[18px] right-[20px] cursor-pointer text-white w-[25px] h-[25px]"
            />
          )}
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        {/* General error */}
        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}

        {/* Submit */}
        <button
          disabled={loading}
          className={`min-w-[150px] h-[60px] mt-[30px] cursor-pointer font-semibold rounded-full text-[19px] ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-white text-black"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p
          className="text-white cursor-pointer text-[18px]"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
