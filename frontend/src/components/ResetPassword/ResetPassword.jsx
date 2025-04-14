// import React, { useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// // import axios from "../../lib/axios"; // Make sure this is your custom axios instance
// import { useResetPasswordMutation } from "../../slices/apiSlice";

// const ResetPassword = () => {
//   const [resetPassword, { isLoading }] = useResetPasswordMutation();
//   const [formData, setFormData] = useState({
//     newPassword: "",
//     confirmPassword: ""
//   });
//   const [showPassword, setShowPassword] = useState({
//     new: false,
//     confirm: false
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");
//   const navigate = useNavigate();

//   const validatePassword = (password) => {
//     const conditions = {
//       length: password.length >= 8,
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       number: /[0-9]/.test(password),
//       special: /[!@#$%^&*]/.test(password)
//     };
//     return conditions;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     if (name === "newPassword") {
//       const validationResult = validatePassword(value);
//       setErrors(prev => ({
//         ...prev,
//         newPassword: Object.values(validationResult).some(condition => !condition)
//           ? "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
//           : ""
//       }));
//     }

//     if (name === "confirmPassword") {
//       setErrors(prev => ({
//         ...prev,
//         confirmPassword: value !== formData.newPassword ? "Passwords do not match" : ""
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
  
//     console.log(" Form is being submitted");
  
//     if (!token) {
//       toast.error("Missing reset token");
//       setIsSubmitting(false);
//       return;
//     }
  
//     try {
//       console.log("Calling resetPassword...");
//       const res = await resetPassword({ token, newPassword: formData.newPassword }).unwrap();
//       toast.success(res.message || "Password reset successful!");
//       navigate("/");
//     } catch (error) {
//       console.error("  Error:", error);
//       toast.error(error?.data?.message || "Reset failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
  

//   return (
//     <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
//          style={{
//            backgroundImage: "url('images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3')",
//            backgroundSize: "cover",
//            backgroundPosition: "center"
//          }}>
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl backdrop-blur-lg bg-opacity-90">
//         <div className="text-center">
//         <img
//           className="mx-auto h-12 w-auto rounded-full shadow-lg"
//           src="https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?ixlib=rb-4.0.3"
//           alt="Company Logo"
//         />

//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset Password</h2>
//           <p className="mt-2 text-sm text-gray-600">Enter your new password below</p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div className="relative">
//               <label htmlFor="newPassword" className="sr-only">New Password</label>
//               <input
//                 id="newPassword"
//                 name="newPassword"
//                 type={showPassword.new ? "text" : "password"}
//                 required
//                 className={`appearance-none relative block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out`}
//                 placeholder="New Password"
//                 value={formData.newPassword}
//                 onChange={handleInputChange}
//                 aria-invalid={errors.newPassword ? "true" : "false"}
//                 aria-describedby="newPassword-error"
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
//               >
//                 {showPassword.new ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
//               </button>
//             </div>
//             {errors.newPassword && (
//               <p className="text-red-500 text-xs mt-1" id="newPassword-error" role="alert">
//                 {errors.newPassword}
//               </p>
//             )}

//             <div className="relative">
//               <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type={showPassword.confirm ? "text" : "password"}
//                 required
//                 className={`appearance-none relative block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out`}
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//                 aria-invalid={errors.confirmPassword ? "true" : "false"}
//                 aria-describedby="confirmPassword-error"
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
//               >
//                 {showPassword.confirm ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
//               </button>
//             </div>
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1" id="confirmPassword-error" role="alert">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col space-y-4">
//               <button
//                 type="submit"
//                 disabled={
//                   isSubmitting ||
//                   Object.values(errors).some((error) => error) ||  // check if any value is non-empty
//                   formData.newPassword !== formData.confirmPassword
//                 }
//                 className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isSubmitting || Object.keys(errors).length > 0 ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'} transition-all duration-150 ease-in-out transform hover:scale-[1.02]`}
//               >
//                 {isSubmitting ? (
//                   <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                   </span>
//                 ) : null}
//                 {isSubmitting ? "Resetting Password..." : "Reset Password"}
//               </button>
//           </div>

//           <div className="password-requirements mt-4">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h3>
//             <ul className="space-y-1">
//   {[
//     { condition: validatePassword(formData.newPassword).length, text: "At least 8 characters" },
//     { condition: validatePassword(formData.newPassword).uppercase, text: "One uppercase letter" },
//     { condition: validatePassword(formData.newPassword).lowercase, text: "One lowercase letter" },
//     { condition: validatePassword(formData.newPassword).number, text: "One number" },
//     { condition: validatePassword(formData.newPassword).special, text: "One special character" }
//   ].map((requirement, index) => (
//     <li key={index} className="flex items-center text-sm">
//       {requirement.condition ? (
//         <i className="fa-solid fa-check fa-2xs mr-2" style={{ color: "#0fc724" }}></i>
//       ) : (
//         <i className="fa-solid fa-xmark fa-2xs mr-2" style={{ color: "#08af2a" }}></i>
//       )}
//       <span className={requirement.condition ? "text-green-500" : "text-red-500"}>
//         {requirement.text}
//       </span>
//     </li>
//   ))}
// </ul>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../../slices/apiSlice";

const ResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  // Check token on component mount
  useEffect(() => {
    if (!token) {
      setTokenError(true);
      toast.error("Missing reset token in URL");
    } else {
      console.log("Token found in URL:", token.substring(0, 10) + "...");
    }
  }, [token]);

  const validatePassword = (password) => {
    const conditions = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    return conditions;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      const validationResult = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        newPassword: Object.values(validationResult).some(condition => !condition)
          ? "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
          : ""
      }));
    }

    if (name === "confirmPassword") {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== formData.newPassword ? "Passwords do not match" : ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!token) {
      toast.error("Missing reset token");
      setIsSubmitting(false);
      setTokenError(true);
      return;
    }

    // Additional validation before submission
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }));
      setIsSubmitting(false);
      return;
    }

    const validationResult = validatePassword(formData.newPassword);
    if (Object.values(validationResult).some(condition => !condition)) {
      setErrors(prev => ({
        ...prev,
        newPassword: "Password doesn't meet the requirements"
      }));
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log("Submitting reset password with token:", token.substring(0, 10) + "...");
      console.log("Request payload:", { token, newPassword: formData.newPassword });
      
      const res = await resetPassword({ 
        token, 
        newPassword: formData.newPassword 
      }).unwrap();
      
      console.log("Reset password response:", res);
      toast.success(res.message || "Password reset successful!");
      navigate("/");
    } catch (error) {
      console.error("Reset password error:", error);
      
      if (error?.data?.message === "Invalid token") {
        setTokenError(true);
        toast.error("Your password reset link is invalid or has expired. Please request a new one.");
      } else {
        toast.error(error?.data?.message || "Password reset failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "" };
    
    const conditions = validatePassword(password);
    const metConditions = Object.values(conditions).filter(Boolean).length;
    
    if (metConditions <= 2) return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (metConditions === 3) return { strength: 50, label: "Medium", color: "bg-yellow-500" };
    if (metConditions === 4) return { strength: 75, label: "Strong", color: "bg-blue-500" };
    return { strength: 100, label: "Very Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Your Password</h2>
        
        {tokenError && (
          <div className="mb-6 p-4 bg-red-100 rounded-md text-red-700">
            Invalid or expired reset link. Please request a new password reset link.
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="newPassword">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword.new ? "text" : "password"}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.newPassword ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={isSubmitting || tokenError}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? "Hide" : "Show"}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
            )}
            
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">Password Strength: {passwordStrength.label}</span>
                  <span className="text-xs text-gray-600">{passwordStrength.strength}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${passwordStrength.color}`} 
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className={`mr-2 w-4 h-4 rounded-full ${validatePassword(formData.newPassword).length ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <span className="text-xs">8+ characters</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`mr-2 w-4 h-4 rounded-full ${validatePassword(formData.newPassword).uppercase ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <span className="text-xs">Uppercase</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`mr-2 w-4 h-4 rounded-full ${validatePassword(formData.newPassword).lowercase ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <span className="text-xs">Lowercase</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`mr-2 w-4 h-4 rounded-full ${validatePassword(formData.newPassword).number ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <span className="text-xs">Number</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`mr-2 w-4 h-4 rounded-full ${validatePassword(formData.newPassword).special ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <span className="text-xs">Special (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirm ? "text" : "password"}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting || tokenError}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md transition ${
              tokenError ? 
                "bg-gray-400 cursor-not-allowed" : 
                "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isSubmitting || tokenError}
          >
            {isLoading || isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
          
          {tokenError && (
            <div className="mt-4 text-center">
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Request a new reset link
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;