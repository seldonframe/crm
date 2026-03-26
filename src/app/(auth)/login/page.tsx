import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-[hsl(var(--color-text-secondary))]">Sign in to continue to your CRM framework.</p>
      </div>
      <LoginForm />
    </div>
  );
}
