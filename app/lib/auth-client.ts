import { emailOTPClient, twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";

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
