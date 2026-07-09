<script setup lang="ts">
import { useAuthSession } from "~/composables/useAuth";
import { useAuthUi } from "~/composables/useAuthUi";

const { data: session } = await useAuthSession();
const { openAuthModal } = useAuthUi();
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_28%)]" />

    <div class="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
      <div class="flex flex-col justify-center">
        <p class="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-accent">
          Secure Weekly Cooking
        </p>

        <h1 class="mt-8 max-w-3xl text-5xl font-black uppercase leading-[0.95] text-base-content sm:text-6xl lg:text-7xl">
          Plan meals, save favorites, and keep your kitchen flow locked down.
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-8 text-base-content/70 sm:text-xl">
          Crunchy Kitchen gives your recipes, prep notes, and grocery rhythm a clean home. Sign in with email and two-factor protection, or jump in with Google when you need a faster path.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <button class="btn btn-accent btn-lg rounded-full px-8" type="button" @click="openAuthModal('sign-up')">
            Start cooking securely
          </button>
          <NuxtLink v-if="session" to="/dashboard" class="btn btn-outline btn-lg rounded-full px-8">
            Open dashboard
          </NuxtLink>
        </div>

        <dl class="mt-12 grid gap-4 sm:grid-cols-3">
          <div class="rounded-[1.75rem] border border-base-300/80 bg-base-100/90 p-5 shadow-sm">
            <dt class="text-xs font-black uppercase tracking-[0.28em] text-accent">
              Protected access
            </dt>
            <dd class="mt-3 text-sm leading-6 text-base-content/70">
              Email and password accounts are enrolled into email-based 2FA so your recipes stay private.
            </dd>
          </div>
          <div class="rounded-[1.75rem] border border-base-300/80 bg-base-100/90 p-5 shadow-sm">
            <dt class="text-xs font-black uppercase tracking-[0.28em] text-accent">
              Google shortcut
            </dt>
            <dd class="mt-3 text-sm leading-6 text-base-content/70">
              Use Google as a second sign-in path when your OAuth credentials are configured.
            </dd>
          </div>
          <div class="rounded-[1.75rem] border border-base-300/80 bg-base-100/90 p-5 shadow-sm">
            <dt class="text-xs font-black uppercase tracking-[0.28em] text-accent">
              Local-first auth
            </dt>
            <dd class="mt-3 text-sm leading-6 text-base-content/70">
              The app starts on a local SQLite-compatible database and can move to Turso later without changing the UI flow.
            </dd>
          </div>
        </dl>
      </div>

      <div class="flex items-center justify-center lg:justify-end">
        <div class="w-full max-w-xl rounded-4xl border border-base-300/80 bg-base-100/95 p-6 shadow-2xl shadow-base-content/5 sm:p-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.28em] text-accent">
                Landing access
              </p>
              <h2 class="mt-3 text-3xl font-black text-base-content">
                Kitchen passport
              </h2>
            </div>
            <div class="badge badge-outline badge-lg rounded-full px-4 py-4 text-xs uppercase tracking-[0.24em]">
              {{ session ? 'Active session' : 'Ready to sign in' }}
            </div>
          </div>

          <div class="mt-8 space-y-4">
            <div class="rounded-3xl bg-base-200 p-5">
              <p class="text-sm font-semibold text-base-content">
                What the auth flow does
              </p>
              <ul class="mt-3 space-y-3 text-sm leading-6 text-base-content/70">
                <li>1. Sign in with email and password.</li>
                <li>2. Receive a second-factor email code if your account is enrolled.</li>
                <li>3. Land on the dashboard after verification.</li>
              </ul>
            </div>

            <div v-if="session" class="rounded-3xl border border-success/30 bg-success/10 p-5">
              <p class="text-xs font-black uppercase tracking-[0.28em] text-success">
                Signed in
              </p>
              <p class="mt-3 text-lg font-semibold text-base-content">
                Welcome back, {{ session.user.name }}.
              </p>
              <p class="mt-2 text-sm leading-6 text-base-content/70">
                Your avatar menu in the header links straight to the dashboard and sign-out actions.
              </p>
              <NuxtLink to="/dashboard" class="btn btn-success mt-5 rounded-full px-6 text-success-content">
                Go to dashboard
              </NuxtLink>
            </div>

            <div v-else class="rounded-3xl border border-base-300 p-5">
              <p class="text-sm leading-6 text-base-content/70">
                Use the header controls to sign in or create an account. New email accounts are enrolled into email OTP-based 2FA automatically.
              </p>
              <button class="btn btn-accent mt-5 rounded-full px-6" type="button" @click="openAuthModal('sign-in')">
                Sign in now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
