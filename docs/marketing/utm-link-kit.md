# UTM link kit

Copy-paste tagged URLs for channels Max posts by hand. For links SF renders
programmatically (badges, embeds, emails, registry listings), the tagging is
already baked into the code — see the PR that introduced this file for the
full surface-by-surface inventory.

## Taxonomy

- `utm_source` = the surface / channel (where the click came from)
- `utm_medium` = the mechanism (what kind of placement it was)
- `utm_campaign` / `utm_content` used sparingly, only where a specific push
  or sub-surface needs to be distinguished
- **Never tag agency-whitelabeled URLs.** Any link that substitutes an
  agency's own domain or `supportUrl` must stay untouched — UTM params only
  go on SeldonFrame-owned fallback URLs.

## Target URLs

- `https://seldonframe.com/`
- `https://seldonframe.com/try`

## Hand-posted channels

| Channel | utm_source | utm_medium | Example (root) |
| --- | --- | --- | --- |
| YouTube video description | `youtube` | `video_description` | `https://seldonframe.com/?utm_source=youtube&utm_medium=video_description` |
| X post | `x` | `post` | `https://seldonframe.com/?utm_source=x&utm_medium=post` |
| Reddit post | `reddit` | `post` | `https://seldonframe.com/?utm_source=reddit&utm_medium=post` |
| ChatGPT apps directory listing | `chatgpt_app` | `listing` | `https://seldonframe.com/?utm_source=chatgpt_app&utm_medium=listing` |
| Glama / MCP registry | `mcp_registry` | `listing` | already covered — see `skills/mcp-server/server.json` `websiteUrl` |
| npm README | `npm` | `readme` | `https://seldonframe.com/?utm_source=npm&utm_medium=readme` |
| GitHub README | `github` | `readme` | `https://seldonframe.com/?utm_source=github&utm_medium=readme` |

Same table, pointed at `/try` instead of `/`:

| Channel | Example (/try) |
| --- | --- |
| YouTube video description | `https://seldonframe.com/try?utm_source=youtube&utm_medium=video_description` |
| X post | `https://seldonframe.com/try?utm_source=x&utm_medium=post` |
| Reddit post | `https://seldonframe.com/try?utm_source=reddit&utm_medium=post` |
| ChatGPT apps directory listing | `https://seldonframe.com/try?utm_source=chatgpt_app&utm_medium=listing` |
| npm README | `https://seldonframe.com/try?utm_source=npm&utm_medium=readme` |
| GitHub README | `https://seldonframe.com/try?utm_source=github&utm_medium=readme` |

## Rules

1. `utm_source` = surface, `utm_medium` = mechanism. Don't swap them.
2. Never tag an agency-whitelabeled URL (customer-facing white-label emails
   and portals substitute the agency's own domain/support URL — those stay
   bare).
3. Reuse the same `utm_source` value across every SF-controlled surface for
   that channel so PostHog/GA can roll them up without a mapping table.
