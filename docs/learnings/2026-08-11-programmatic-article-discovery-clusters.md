# Programmatic article discovery clusters

## The problem, in one line

Ten published, indexed articles were technically live but hard for visitors and crawlers to discover as one coherent problem-solving collection.

## The approach

1. Inventory the canonical article registry, existing hubs, global navigation, high-intent pages, Markdown alternates, and sitemap before adding another content system.
2. Define one pure discovery model that resolves article slugs through the existing registry, groups them by reader intent, and renders the agent-readable Markdown collection.
3. Publish one canonical HTML collection with a Markdown alternate, honest fit boundaries, and `CollectionPage`, `ItemList`, and `BreadcrumbList` structured data.
4. Create several short discovery paths: the main guides hub, the Resources menu, the comparison page, the cost calculator, and three deterministic sibling links on each complaint-led article.
5. Pin each path with server-render tests, including the negative contracts: unrelated guides get no sibling mesh and unrelated competitors get no GoHighLevel callout.
6. Add one explicit sitemap entry for the collection and keep individual articles in the registry-derived sitemap loop.

## Judgment calls

- No new CMS, database table, dependency, or duplicated article body was added; the existing guide registry remains the source of truth.
- The collection groups may intentionally repeat export and ownership guides under both diagnosis and migration, while structured data deduplicates them into one ordered item list.
- The primary marketing navigation uses literal lightweight paths instead of importing the discovery model into a Client Component, which would pull the full guide registry into the client bundle.
- SeldonFrame is presented as a focused alternative for AI-front-office agency work, not as a universal replacement for every HighLevel funnel, campaign, snapshot, or ecosystem workflow.
- Discovery links were added only where user intent is strong; unrelated guides and competitor pages remain unchanged.

## The reusable rule, one line

For a programmatic content cluster, publish from one registry but distribute discovery through a canonical hub, agent-readable alternate, intent-specific entry points, sibling mesh, structured data, and sitemap—with negative tests preventing irrelevant cross-link leakage.
