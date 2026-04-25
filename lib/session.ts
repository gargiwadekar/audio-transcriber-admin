import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_EMAIL } from "@/lib/constants";
import { auth } from "@/lib/auth";

export async function getCurrentSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.email !== ADMIN_EMAIL) {
    return null;
  }

  return session;
}

export async function getAdminSessionFromHeaders(requestHeaders: Headers) {
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.email !== ADMIN_EMAIL) {
    return null;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
