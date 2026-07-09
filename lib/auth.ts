import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { emailOTP, twoFactor } from "better-auth/plugins";

import { db } from "./db/client";
import { schema } from "./db/schema";

function isEmailConfigured() {
  return Boolean(process.env.DEV_MAIL_TO || process.env.SMTP_HOST);
}

const googleAuthEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

async function sendAuthEmail(subject: string, lines: string[]) {
  if (!isEmailConfigured()) {
    console.info(`[auth email skipped] ${subject}\n${lines.join("\n")}`);
    return;
  }

  console.info(`[auth email simulated] ${subject}\n${lines.join("\n")}`);
}

export const auth = betterAuth({
  appName: "Crunchy Kitchen",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail("Reset your Crunchy Kitchen password", [
        `To: ${user.email}`,
        `Reset your password here: ${url}`,
      ]);
    },
  },
  ...(googleAuthEnabled ? {
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        prompt: "select_account",
      },
    },
  } : {}),
  plugins: [
    emailOTP({
      disableSignUp: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        await sendAuthEmail(`Crunchy Kitchen ${type} code`, [
          `To: ${email}`,
          `Your verification code is: ${otp}`,
          `Flow: ${type}`,
        ]);
      },
    }),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendAuthEmail("Crunchy Kitchen 2FA code", [
            `To: ${user.email}`,
            `Your sign-in code is: ${otp}`,
          ]);
        },
      },
    }),
  ],
});