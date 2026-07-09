<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import { useAuthClient, useAuthSession } from "~/composables/useAuth";
import { useAuthUi } from "~/composables/useAuthUi";
type AuthStage = "credentials" | "otp";

const auth = useAuthClient();
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const { data: session } = await useAuthSession();
const { authMode, closeAuthModal, isAuthOpen, openAuthModal } = useAuthUi();

const googleEnabled = computed(() => runtimeConfig.public.googleAuthEnabled);
const isPending = ref(false);
const authStage = ref<AuthStage>("credentials");
const errorMessage = ref("");
const infoMessage = ref("");

const signInForm = reactive({
  email: "",
  password: "",
  rememberMe: true,
});

const signUpForm = reactive({
  name: "",
  email: "",
  password: "",
});

const otpForm = reactive({
  code: "",
  trustDevice: true,
});

const currentUser = computed(() => session.value?.user || null);
const avatarLabel = computed(() => {
  const name = currentUser.value?.name?.trim();
  if (!name)
    return "CK";

  return name
    .split(" ")
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || "")
    .join("");
});

type AuthMode = "sign-in" | "sign-up";

function openModal(mode: AuthMode) {
  openAuthModal(mode);
  authStage.value = "credentials";
  errorMessage.value = "";
  infoMessage.value = mode === "sign-up"
    ? "New email accounts are enrolled into email 2FA after creation."
    : "";
  otpForm.code = "";
}

function closeModal() {
  closeAuthModal();
  authStage.value = "credentials";
  errorMessage.value = "";
  infoMessage.value = "";
  otpForm.code = "";
}

async function navigateToDashboard() {
  closeModal();
  await router.push("/dashboard");
}

async function ensureEmailTwoFactor(password: string) {
  const sessionResult = await auth.getSession();

  if (!sessionResult.data?.user || sessionResult.data.user.twoFactorEnabled)
    return;

  const enableResult = await auth.twoFactor.enable({ password });

  if (enableResult.error) {
    infoMessage.value = "Signed in, but email 2FA could not be enabled automatically yet.";
    return;
  }
}

async function startOtpChallenge() {
  const sendResult = await auth.twoFactor.sendOtp();

  if (sendResult.error) {
    errorMessage.value = sendResult.error.message ?? "Unable to send a one-time code right now.";
    return false;
  }

  authStage.value = "otp";
  infoMessage.value = "A sign-in code has been sent to your email address.";
  return true;
}

async function submitSignUp() {
  isPending.value = true;
  errorMessage.value = "";
  infoMessage.value = "";

  const result = await auth.signUp.email({
    name: signUpForm.name,
    email: signUpForm.email,
    password: signUpForm.password,
  });

  if (result.error) {
    errorMessage.value = result.error.message ?? "Unable to create account.";
    isPending.value = false;
    return;
  }

  await ensureEmailTwoFactor(signUpForm.password);
  await navigateToDashboard();
  isPending.value = false;
}

async function submitSignIn() {
  isPending.value = true;
  errorMessage.value = "";
  infoMessage.value = "";

  const result = await auth.signIn.email({
    email: signInForm.email,
    password: signInForm.password,
    rememberMe: signInForm.rememberMe,
  });

  if (result.error) {
    errorMessage.value = result.error.message ?? "Sign-in failed. Check your credentials and try again.";
    isPending.value = false;
    return;
  }

  const response = result.data as { twoFactorRedirect?: boolean; twoFactorMethods?: string[] } | null;

  if (response?.twoFactorRedirect) {
    if (!response.twoFactorMethods?.includes("otp")) {
      errorMessage.value = "This account needs a second factor, but email OTP is not available.";
      isPending.value = false;
      return;
    }

    await startOtpChallenge();
    isPending.value = false;
    return;
  }

  await ensureEmailTwoFactor(signInForm.password);
  await navigateToDashboard();
  isPending.value = false;
}

async function submitOtp() {
  isPending.value = true;
  errorMessage.value = "";

  const result = await auth.twoFactor.verifyOtp({
    code: otpForm.code,
    trustDevice: otpForm.trustDevice,
  });

  if (result.error) {
    errorMessage.value = result.error.message ?? "That code is invalid or expired.";
    isPending.value = false;
    return;
  }

  await navigateToDashboard();
  isPending.value = false;
}

async function resendOtp() {
  isPending.value = true;
  errorMessage.value = "";
  await startOtpChallenge();
  isPending.value = false;
}

async function handleGoogleSignIn() {
  errorMessage.value = "";

  if (!googleEnabled.value) {
    errorMessage.value = "Google sign-in is not configured yet. Add Google OAuth credentials to your environment first.";
    return;
  }

  await auth.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
}

async function handleSignOut() {
  await auth.signOut();
  await router.push("/");
}
</script>

<template>
  <div>
    <div v-if="currentUser" class="dropdown dropdown-end">
      <button class="btn btn-ghost gap-3 rounded-full border border-base-300/80 bg-base-100 px-3 shadow-sm">
        <div class="avatar placeholder">
          <div v-if="currentUser.image" class="w-10 rounded-full ring ring-accent/30 ring-offset-2 ring-offset-base-100">
            <img :src="currentUser.image" :alt="currentUser.name">
          </div>
          <div v-else class="w-10 rounded-full bg-accent text-accent-content">
            <span class="text-sm font-bold">{{ avatarLabel }}</span>
          </div>
        </div>

        <div class="hidden text-left sm:block">
          <p class="text-sm font-semibold leading-tight">{{ currentUser.name }}</p>
          <p class="text-xs opacity-65">{{ currentUser.email }}</p>
        </div>
      </button>

      <ul class="menu dropdown-content z-1 mt-3 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
        <li>
          <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        </li>
        <li>
          <button type="button" @click="handleSignOut">Sign out</button>
        </li>
      </ul>
    </div>

    <div v-else class="flex items-center gap-2">
      <button class="btn btn-ghost" type="button" @click="openModal('sign-in')">
        Sign in
      </button>
      <button class="btn btn-accent" type="button" @click="openModal('sign-up')">
        Get started
      </button>
    </div>

    <Teleport to="body">
      <div v-if="isAuthOpen" class="modal modal-open z-100">
        <div class="modal-box max-w-lg border border-base-300 bg-base-100 p-0 shadow-2xl">
          <div class="flex items-start justify-between border-b border-base-300 px-6 py-5">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.28em] text-accent">Crunchy Kitchen</p>
              <h3 class="mt-2 text-2xl font-black text-base-content">
                {{ authStage === 'otp' ? 'Verify your sign-in' : authMode === 'sign-in' ? 'Welcome back' : 'Create your account' }}
              </h3>
              <p class="mt-2 text-sm opacity-70">
                {{ authStage === 'otp'
                  ? 'Enter the email code to finish signing in.'
                  : authMode === 'sign-in'
                    ? 'Use your email, password, and email-based 2FA.'
                    : 'Set up your kitchen account and we will enroll email 2FA automatically.' }}
              </p>
            </div>

            <button class="btn btn-sm btn-circle btn-ghost" type="button" @click="closeModal">✕</button>
          </div>

          <div class="space-y-5 px-6 py-6">
            <div v-if="authStage === 'credentials'" class="tabs tabs-boxed bg-base-200 p-1">
              <button
                class="tab flex-1"
                :class="{ 'tab-active': authMode === 'sign-in' }"
                type="button"
                @click="authMode = 'sign-in'"
              >
                Sign in
              </button>
              <button
                class="tab flex-1"
                :class="{ 'tab-active': authMode === 'sign-up' }"
                type="button"
                @click="authMode = 'sign-up'"
              >
                Create account
              </button>
            </div>

            <div v-if="errorMessage" class="alert alert-error text-sm">
              <span>{{ errorMessage }}</span>
            </div>

            <div v-if="infoMessage" class="alert alert-info text-sm">
              <span>{{ infoMessage }}</span>
            </div>

            <form v-if="authStage === 'credentials' && authMode === 'sign-in'" class="space-y-4" @submit.prevent="submitSignIn">
              <label class="form-control w-full gap-2">
                <span class="label-text font-semibold">Email</span>
                <input v-model="signInForm.email" class="input input-bordered w-full" type="email" placeholder="chef@crunchykitchen.app" required>
              </label>

              <label class="form-control w-full gap-2">
                <span class="label-text font-semibold">Password</span>
                <input v-model="signInForm.password" class="input input-bordered w-full" type="password" placeholder="At least 8 characters" required minlength="8">
              </label>

              <label class="label cursor-pointer justify-start gap-3 rounded-box border border-base-300 px-4 py-3">
                <input v-model="signInForm.rememberMe" class="checkbox checkbox-accent" type="checkbox">
                <span class="label-text">Keep me signed in on this device</span>
              </label>

              <button class="btn btn-accent w-full" type="submit" :disabled="isPending">
                <span v-if="isPending" class="loading loading-spinner loading-sm" />
                Sign in with email
              </button>
            </form>

            <form v-else-if="authStage === 'credentials'" class="space-y-4" @submit.prevent="submitSignUp">
              <label class="form-control w-full gap-2">
                <span class="label-text font-semibold">Name</span>
                <input v-model="signUpForm.name" class="input input-bordered w-full" type="text" placeholder="Kitchen captain" required>
              </label>

              <label class="form-control w-full gap-2">
                <span class="label-text font-semibold">Email</span>
                <input v-model="signUpForm.email" class="input input-bordered w-full" type="email" placeholder="chef@crunchykitchen.app" required>
              </label>

              <label class="form-control w-full gap-2">
                <span class="label-text font-semibold">Password</span>
                <input v-model="signUpForm.password" class="input input-bordered w-full" type="password" placeholder="At least 8 characters" required minlength="8">
              </label>

              <button class="btn btn-accent w-full" type="submit" :disabled="isPending">
                <span v-if="isPending" class="loading loading-spinner loading-sm" />
                Create account
              </button>
            </form>

            <form v-else class="space-y-4" @submit.prevent="submitOtp">
              <label class="form-control w-full gap-2">
                <span class="label-text font-semibold">One-time code</span>
                <input v-model="otpForm.code" class="input input-bordered w-full tracking-[0.3em]" type="text" inputmode="numeric" maxlength="8" placeholder="123456" required>
              </label>

              <label class="label cursor-pointer justify-start gap-3 rounded-box border border-base-300 px-4 py-3">
                <input v-model="otpForm.trustDevice" class="checkbox checkbox-accent" type="checkbox">
                <span class="label-text">Trust this device for 30 days</span>
              </label>

              <button class="btn btn-accent w-full" type="submit" :disabled="isPending">
                <span v-if="isPending" class="loading loading-spinner loading-sm" />
                Verify code
              </button>

              <button class="btn btn-ghost w-full" type="button" :disabled="isPending" @click="resendOtp">
                Resend code
              </button>
            </form>

            <div class="divider my-1">or</div>

            <button class="btn btn-outline w-full justify-center gap-3" type="button" :disabled="isPending || !googleEnabled" @click="handleGoogleSignIn">
              <span class="text-lg">G</span>
              Continue with Google
            </button>

            <p v-if="!googleEnabled" class="text-center text-xs opacity-60">
              Add Google OAuth credentials to enable Google sign-in.
            </p>
          </div>
        </div>

        <div class="modal-backdrop" @click="closeModal" />
      </div>
    </Teleport>
  </div>
</template>