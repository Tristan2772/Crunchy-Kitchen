import { authClient } from "~~/lib/auth-client";

export function useAuthClient() {
  return authClient;
}

export async function useAuthSession() {
  return authClient.useSession(useFetch);
}