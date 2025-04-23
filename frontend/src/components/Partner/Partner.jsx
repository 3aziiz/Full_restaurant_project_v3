import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@material-tailwind/react";
import { useRegisterPartnerMutation } from "../../slices/apiSlice";

function Partner() {
  const [registerPartner, { isLoading }] = useRegisterPartnerMutation();

  const [confirmPassword, setConfirmPassword] = useState("");

  // State for user data input
  let [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    status: "pending",
  });

  // Handle input change for form fields
  let handleInputChange = (event) => {
    let fieldName = event.target.name;
    let newValue = event.target.value;

    setData((currentData) => ({
      ...currentData,
      [fieldName]: newValue,
    }));
  };

  // Submit handler for the form
  const submitHandler = async (event) => {
    event.preventDefault();
    if (data.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await registerPartner(data).unwrap();
      if (response.success) {
        toast.success("Your partner request has been submitted successfully! Please check your email for approval status.");
        
        setData({
          fullName: "",
          email: "",
          password: "",
          status: "pending",
        });
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Partner registration request failed"
      );
    }
  };

  return (
    <>
      <div className="mt-4 ml-4">
        <Link to="/">
          <Button 
          variant="gradient"
          size="md"
          color="black"
          className="mx-auto">
            Go back
          </Button>
        </Link>
      </div>
      <section className="bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-4 py-6 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Request Restaurant Partner Access
              </h1>
              
              {/* Information alert */}
              <div className="p-4 mb-4 text-sm text-blue-800 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800">
                <p className="font-medium">Partner Registration Information</p>
                <ul className="mt-1.5 ml-4 list-disc">
                  <li>This form submits a partner request to administrators</li>
                  <li>Check your email for approval status updates</li>
                  <li>Once approved, you can log in and manage your restaurant</li>
                </ul>
              </div>

              <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={data.fullName}
                    onChange={handleInputChange}
                    id="fullName"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleInputChange}
                    id="email"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleInputChange}
                    id="password"
                    required
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    required
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white bg-[#ff6347] hover:bg-[#fa2600] focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  {isLoading ? "Submitting..." : "Submit Partner Request"}
                </button>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  After approval, you'll be able to create and manage your restaurant through your dashboard
                </p>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
}

export default Partner;