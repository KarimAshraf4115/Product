import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
// abstract highlights to change as we want
const highlights = [
  {
    title: "One Login. Every Platform.",
    body: "Stop juggling five different tabs. Write once, publish everywhere — Facebook, Instagram, TikTok.",
  },
  {
    title: "Built to Actually Work",
    body: "Reliability is the whole point. Know what published, what failed, and why ... before your audience does.",
  },
  {
    title: "Made for How Egypt Posts",
    body: "No bloated enterprise pricing, no features you'll never touch. Just the tools creators here actually need.",
  },
];

function LeftPanel() {
  return (
    <div className="flex flex-col justify-center space-y-6 min-h-full bg-linear-to-r from-slate-900 to-slate-700 p-6 max-md:order-1 md:space-y-16">
      {highlights.map((item, i) => (
        <div
          key={item.title}
          className="animate-fade-slide-up"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <h2 className="text-white text-lg font-medium dark:text-slate-50">
            {item.title}
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

interface User {
  name: string;
  dateOfBirth: string;
  email: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const form = useForm<User>({
    defaultValues: {
      name: "",
      dateOfBirth: "",
      email: "",
      gender: "",
      password: "",
      confirmPassword: "",
    },
  });

  // register new field to the object
  // register function return object {onChange , onBlur , ref , name}
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = form;

  function handleRegister(data: User) {
    console.log(data);
    reset();
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await res.json();
      console.log(profile);
    },
    onError: () => {
      console.log("Google login failed");
    },
  });
  return (
    <main className="max-w-full">
      <div className="grid items-center gap-y-10 bg-white border border-slate-100 [box-shadow:0_2px_10px_-3px_rgba(14,14,14,0.3)] overflow-hidden md:grid-cols-3 dark:bg-neutral-800 dark:border-neutral-700 min-h-screen">
        <LeftPanel />

        <div className="w-full py-6 px-6 max-w-lg mx-auto md:col-span-2 md:px-14">
          <div className="mb-10">
            <h1 className="text-slate-900 text-2xl font-bold dark:text-slate-50">
              Create an account
            </h1>
          </div>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Name
              </label>
              <input
                {...register("name", {
                  required: { value: true, message: "Name is required" },
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                type="text"
                id="name"
                placeholder=""
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth", {
                  required: {
                    value: true,
                    message: "Date of birth is required",
                  },
                  validate: (value) => {
                    const birthDate = new Date(value);
                    const today = new Date();

                    let age = today.getFullYear() - birthDate.getFullYear();
                    const hasHadBirthdayThisYear =
                      today.getMonth() > birthDate.getMonth() ||
                      (today.getMonth() === birthDate.getMonth() &&
                        today.getDate() >= birthDate.getDate());

                    if (!hasHadBirthdayThisYear) age--;

                    return age >= 18 || "You must be at least 18 years old";
                  },
                })}
                type="date"
                id="dateOfBirth"
                placeholder=""
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Email
              </label>
              <input
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                type="email"
                id="email"
                placeholder="Content-Creator@gmail.com"
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Password
              </label>
              <input
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
                    message:
                      "Password must include an uppercase letter, a lowercase letter, and a special character",
                  },
                })}
                type="password"
                id="password"
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600"
              />
              <ul className="mt-1.5 text-xs text-gray-400 space-y-0.5">
                <li>At least 8 characters</li>
                <li>One uppercase and one lowercase letter</li>
                <li>One special character</li>
              </ul>
              {errors.password && (
                <p className=" text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Confirm password
              </label>
              <input
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Please confirm your password",
                  },
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                type="password"
                id="confirm-password"
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start flex-wrap gap-2">
              <label className="flex items-center group has-[input:checked]:text-slate-900">
                <input
                  id="tmc"
                  name="tmc"
                  type="checkbox"
                  className="sr-only"
                />
                {/* Custom box */}
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded outline-1 outline-slate-300 dark:outline-neutral-600
                           bg-white dark:bg-neutral-700
                           group-has-[input:checked]:bg-blue-600
                           group-has-[input:checked]:outline-blue-600
                           group-focus-within:outline-2
                           group-focus-within:outline-blue-600"
                  aria-hidden="true"
                >
                  {/* Checkmark */}
                  <svg
                    className="size-3 text-white opacity-0 group-has-[input:checked]:opacity-100"
                    viewBox="0 0 12 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 5l3 3 7-7" />
                  </svg>
                </span>
                <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">
                  I accept the
                </span>
              </label>

              <a
                href="#"
                className="ml-1 text-sm font-medium text-blue-700 dark:text-blue-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Terms and Conditions
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Create an account
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-600" />
              <span className="text-xs text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-600" />
            </div>
            <button
              type="button"
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-slate-50 dark:hover:bg-neutral-600"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>
          </form>

          <div className="mt-6 text-slate-900 text-sm text-center dark:text-slate-50">
            Already have an account?{" "}
            <a
              href="#"
              className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Login here
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
