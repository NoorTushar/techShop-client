import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../provider/AuthProvider";
import useAxiosCommon from "../provider/useAxiosCommon";

const Login = () => {
   const axiosCommon = useAxiosCommon();
   const [pageLoading, setLoading] = useState(false);
   const navigate = useNavigate();
   const location = useLocation();
   const from = location?.state || "/home";
   const { loginWithGoogle, logIn, loading } = useContext(AuthContext);
   const [email, setEmail] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const email = form.email.value;
      const password = form.password.value;

      try {
         setLoading(true);
         // 1. sign in user
         await logIn(email, password);
         navigate(from);
         toast.success("Signup Successful");
      } catch (err) {
         console.log(err);
         toast.error(err.message);
         setLoading(false);
      }
   };

   // const handleGoogleSignIn = async () => {
   //   try {
   //     const result = await loginWithGoogle();
   //     const user = result.user;

   //     // send user to db
   //     const userInfo = { name: user.displayName, email: user.email };

   //     axiosCommon.post("/users", userInfo).then((res) => {
   //       if (res.data.insertedId) {
   //         navigate("/home");
   //         toast.success("Signup Successful, user added");
   //       }
   //     });
   //   } catch (err) {
   //     console.log(err);
   //     toast.error(err.message);
   //   }
   // };

   const handleGoogleSignIn = async () => {
      try {
         const result = await loginWithGoogle();
         const user = result.user;

         // Check if the user already exists
         try {
            const response = await axiosCommon.post("/users/check", {
               email: user.email,
            });

            if (response.data.exists) {
               // User already exists, redirect to home
               navigate("/home");
               toast.success("Welcome back");
            } else {
               // User does not exist, add user to the database
               const addUserResponse = await axiosCommon.post("/users", {
                  name: user.displayName,
                  email: user.email,
               });
               if (addUserResponse.data.insertedId) {
                  navigate("/home");
                  toast.success("Sign up Successfully");
               }
            }
         } catch (error) {
            console.error("Error checking user existence:", error);
            toast.error("Error checking user existence");
         }
      } catch (err) {
         console.log(err);
         toast.error(err.message);
      }
   };

   return (
      <div className="flex justify-center items-center min-h-screen">
         <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
            <div className="mb-8 text-center">
               <h1 className="my-3 text-4xl font-bold">Log In</h1>
               <p className="text-sm text-gray-400">
                  Sign in to access your account
               </p>
            </div>
            <form
               onSubmit={handleSubmit}
               className="space-y-6 ng-untouched ng-pristine ng-valid"
            >
               <div className="space-y-4">
                  <div>
                     <label htmlFor="email" className="block mb-2 text-sm">
                        Email address
                     </label>
                     <input
                        type="email"
                        name="email"
                        onBlur={(e) => setEmail(e.target.value)}
                        id="email"
                        required
                        placeholder="Enter Your Email Here"
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-blue-500 bg-gray-200 text-gray-900"
                        data-temp-mail-org="0"
                     />
                  </div>
                  <div>
                     <div className="flex justify-between">
                        <label htmlFor="password" className="text-sm mb-2">
                           Password
                        </label>
                     </div>
                     <input
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        id="password"
                        required
                        placeholder="*******"
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-blue-500 bg-gray-200 text-gray-900"
                     />
                  </div>
               </div>

               <div>
                  <button
                     disabled={loading}
                     type="submit"
                     className="bg-blue-500 w-full rounded-md py-3 text-white"
                  >
                     {loading ? (
                        <TbFidgetSpinner className="animate-spin m-auto" />
                     ) : (
                        "Sign In"
                     )}
                  </button>
               </div>
            </form>
            <div className="space-y-1"></div>
            <div className="flex items-center pt-4 space-x-1">
               <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
               <p className="px-3 text-sm dark:text-gray-400">
                  Login with social accounts
               </p>
               <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
            </div>

            <button
               disabled={loading}
               onClick={handleGoogleSignIn}
               className="disabled:cursor-not-allowed flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer"
            >
               <FcGoogle size={32} />

               <p>Continue with Google</p>
            </button>

            <p className="px-6 text-sm text-center text-gray-400">
               Don&apos;t have an account yet?{" "}
               <Link
                  to="/register"
                  className="hover:underline hover:text-blue-500 text-gray-600"
               >
                  Sign up
               </Link>
               .
            </p>
         </div>
      </div>
   );
};

export default Login;
