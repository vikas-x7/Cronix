/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { BiLogoGithub } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";

type ProviderMap = Awaited<ReturnType<typeof getProviders>>;

const authErrors: Record<string, string> = {
  AccessDenied: "Sign in was cancelled or access was denied.",
  Callback: "OAuth callback could not be completed. Check provider settings.",
  OAuthAccountNotLinked:
    "This email is linked with another sign-in method. Try that method instead.",
  OAuthCallback:
    "Provider callback failed. Check client ID, client secret, and callback URL.",
  OAuthCreateAccount: "Could not create account. Please try again later.",
  Configuration:
    "Auth providers are not configured. Add environment variables.",
  Default: "Sign in failed. Please try again.",
};

type LoginPageProps = {
  error?: string;
};

export default function LoginPage({ error }: LoginPageProps) {
  const [providers, setProviders] = useState<ProviderMap>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProviders() {
      const availableProviders = await getProviders();

      if (isMounted) {
        setProviders(availableProviders);
      }
    }

    void loadProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  const errorMessage = error ? (authErrors[error] ?? authErrors.Default) : null;

  const providersLoaded = providers !== null;
  const hasConfiguredProviders =
    !!providers && Object.keys(providers).length > 0;

  function handleSignIn(providerId: "google" | "github") {
    if (!providers?.[providerId]) {
      return;
    }

    setActiveProvider(providerId);
    void signIn(providerId, { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex bg-white text-black font-inter ">
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="absolute top-0 left-0 flex items-center mt-3 ml-3">
          <img
            src="https://i.pinimg.com/736x/e4/0e/00/e40e00f5f4b301901581046001bfbd61.jpg"
            alt=""
            className="w-11 h-11"
          />
          <h1 className="text-[20px]">cronix</h1>
        </div>
        <div className="w-full max-w-md px-6 text-center ">
          <div className="mb-8 flex flex-col items-center justify-center ">
            <h1 className="text-[30px] flex items-center text-center gap-2 -tracking-[2px]">
              Continue to your account
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Sign in to manage your cron jobs and automation workflows.
            </p>
          </div>

          {errorMessage ? (
            <div className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-left text-xs text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {providersLoaded && !hasConfiguredProviders ? (
            <div className="mb-4 border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-700">
              To enable Google and GitHub authentication, add provider
              credentials in your `.env` file.
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleSignIn("google")}
              disabled={!providers?.google || activeProvider !== null}
              className="w-full py-2 border border-neutral-300 text-[13px] text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                <FcGoogle size={18} />
                {activeProvider === "google"
                  ? "Continue with Google"
                  : "Continue with Google"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSignIn("github")}
              disabled={!providers?.github || activeProvider !== null}
              className="w-full py-2 border border-neutral-300 text-[13px] text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                <BiLogoGithub size={18} />
                {activeProvider === "github"
                  ? "Continue with GitHub"
                  : "Continue with GitHub"}
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
