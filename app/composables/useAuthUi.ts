type AuthMode = "sign-in" | "sign-up";

export function useAuthUi() {
  const isAuthOpen = useState<boolean>("auth-ui-open", () => false);
  const authMode = useState<AuthMode>("auth-ui-mode", () => "sign-in");

  function openAuthModal(mode: AuthMode) {
    authMode.value = mode;
    isAuthOpen.value = true;
  }

  function closeAuthModal() {
    isAuthOpen.value = false;
  }

  return {
    isAuthOpen,
    authMode,
    openAuthModal,
    closeAuthModal,
  };
}