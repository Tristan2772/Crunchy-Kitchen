import { createAuthClient } from "better-auth/vue";
import { emailOTPClient, twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    twoFactorClient(),
  ],
  sessionOptions: {
    refetchOnWindowFocus: true,
  },
});

export const { signIn, signOut, signUp, useSession } = authClient;