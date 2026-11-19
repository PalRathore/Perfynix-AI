import Background from "../common/Background";
import ThemeToggle from "../common/ThemeToggle";
import LeftBranding from "./LeftBranding";

/**
 * Two-column auth shell shared by Login, Signup, and Forgot Password.
 * Desktop: 45% left branding / 55% right card. Mobile: card only.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Unified Dynamic Background */}
      <Background />

      {/* Theme toggle — top-right, always visible across auth screens */}
      <div className="fixed right-5 top-5 z-30 sm:right-7 sm:top-7">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-stretch">
        {/* Left branding — hidden on mobile */}
        <section className="hidden w-[45%] lg:flex">
          <LeftBranding />
        </section>

        {/* Right card */}
        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[55%]">
          <div className="w-full max-w-xl">{children}</div>
        </section>
      </div>
    </div>
  );
}
