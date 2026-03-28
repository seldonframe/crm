import { startStripeConnectAction, getStripeConnectionStatus } from "@/lib/payments/actions";

export default async function PaymentsSettingsPage() {
  const status = await getStripeConnectionStatus();

  return (
    <section className="animate-page-enter space-y-4">
      <div>
        <h1 className="text-page-title">Payments</h1>
        <p className="text-label text-[hsl(var(--color-text-secondary))]">Connect Stripe to accept paid bookings.</p>
      </div>

      <div className="crm-card space-y-3 p-4">
        <p className="text-[11px] uppercase tracking-[0.08em] text-[hsl(var(--color-text-muted))]">Stripe Connect</p>
        {status ? (
          <p className="text-label text-[hsl(var(--color-text-secondary))]">
            Connected account: <span className="font-medium text-foreground">{status.stripeAccountId}</span>
          </p>
        ) : (
          <p className="text-label text-[hsl(var(--color-text-secondary))]">No Stripe account connected.</p>
        )}

        <form action={startStripeConnectAction}>
          <button type="submit" className="crm-button-primary h-10 px-4">
            {status ? "Reconnect Stripe" : "Connect Stripe"}
          </button>
        </form>
      </div>
    </section>
  );
}
