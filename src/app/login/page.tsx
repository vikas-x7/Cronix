import { redirect } from "next/navigation";
import LoginPage from "@/client/markating/Auth";
import { getAuthSession } from "@/lib/auth";

type LoginProps = {
  searchParams?: Promise<{
    error?: string | string[] | undefined;
  }>;
};

export default async function Login({ searchParams }: LoginProps) {
  const session = await getAuthSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const error = Array.isArray(resolvedSearchParams?.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams?.error;

  if (session?.user) {
    redirect("/dashboard");
  }

  return <LoginPage error={error} />;
}
