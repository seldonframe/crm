# Soul System

The Soul is this framework's self-configuring identity layer.

When your client first logs in, they answer 5 simple questions about their business.
The framework then reshapes itself - labels, pipeline, fields, dashboard, AI behavior,
branding, and tone - to match who they are and how they work.

No code changes. No config files. Just a conversation.

## How it works
- Onboarding wizard captures business identity
- Claude (or rule-based fallback) generates a complete CRM configuration
- Every component reads from the soul to personalize the experience
- AI features use the soul as context for drafting, scoring, and categorizing

## For developers
The soul is stored in `organizations.soul` (jsonb). Access it via the `useSoul()` hook
or `getSoul()` server helper. See `src/lib/soul/` for templates and generation logic.

## Why this matters
Your client doesn't get "a CRM." They get THEIR CRM - configured for their business,
their language, their process, their voice. In 5 minutes. Without touching code.
