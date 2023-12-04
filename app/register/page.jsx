"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react"; // to access the user session information.
import Link from "next/link";
import { toast } from "react-toastify"; // used for displaying toast notifications.

const Register = () => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/dashboard");
    }
  }, [sessionStatus, router]);

  const handleSubmit = async (e) => {
    console.log(e)
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill all the input fields");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      });

      if (res.status === 400) {
        toast.error("This email is already registered");
      } else if (res.status === 201) {
        router.push("/login"); // if succeed
      }
    } catch (error) {
      toast.error(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading ...</h1>; //loading state
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold md-4"></h2>

          <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input type="text" name="username" id="username" className="w-full p-2 border border-gray-300 rounded " />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input type="email" name="email" id="email" className="w-full p-2 border border-gray-300 rounded " />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input type="password" name="password" id="password" className="w-full p-2 border border-gray-300 rounded " />
              </div>
              <div className="mb-4">
                <label htmlFor="password-confirm" className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input type="password" name="confirm-password" id="confirm-password" className="w-full p-2 border border-gray-300 rounded " />
              </div>
              <div>
              <button
                type="submit"
                className="mb-5 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Register
              </button>
            </div>

            <span>
              {" "}
              Already have an account?{" "}
              <Link
                className="text-center text-blue-500 hover:underline mt-2"
                href="/login"
              >
                Login In
              </Link>
            </span>
          </form>
        </div>
      </div>
    )
  );
};

export default Register;
