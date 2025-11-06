"use client";

import { BiLogoGithub } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white text-black font-inter">
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-sm px-6 text-center">
          <div className="mb-8 flex flex-col items-center justify-center">
            <img
              src="https://i.pinimg.com/736x/e4/0e/00/e40e00f5f4b301901581046001bfbd61.jpg"
              alt=""
              className="w-15 h-15"
            />
            <h1 className="text-[30px] flex items-center text-center gap-2 -tracking-[2px]">
              Continue to your account
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              Sign in to manage your cron jobs and automation workflows.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full py-2 border border-neutral-300  text-[13px] text-balck transition">
              <span className="flex items-center justify-center gap-2">
                <FcGoogle size={18} />
                Continue with Google
              </span>
            </button>

            <button className="w-full py-2 border border-neutral-300  text-[13px] text-black   transition">
              <span className="flex items-center justify-center gap-2">
                <BiLogoGithub size={18} />
                Continue with GitHub
              </span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-600 text-center mt-6">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://i.pinimg.com/1200x/d4/f2/95/d4f295f565bac558030607f94c215ab5.jpg"
          alt=""
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
}
