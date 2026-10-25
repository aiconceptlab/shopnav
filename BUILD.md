# ShopNav build and acceptance record

## Design choices

Next.js App Router + TypeScript, Zod runtime validation, native React state and a reusable SVG map. The brief recommends Tailwind/shadcn/Zustand but does not require them for behavior; plain CSS and local component state keep this POC smaller. Dijkstra, geometry validation and search are pure shared TypeScript modules used by server and browser. There is no paid mapping SDK, LLM or API integration.

The initial release uses the brief's **local JSON repository** option. No Sites/Cloudflare deployment is claimed: that runtime needs a transactional database adapter rather than writes to a local Node filesystem. The public GitHub project is the distributable deliverable.

## Routing and geometry

Undirected graph, blocked edges excluded, positive explicit traversal weights or Euclidean defaults, stable tie handling. Rectangle-interior intersection checks run both at publication and during route computation, so an unsafe edge in an incomplete draft is not used as a shortcut. Boundaries may be touched, shelf interiors may not. Nodes inside shelves are rejected. Routes end at explicitly chosen access nodes. Walls are represented by absent/blocked graph edges; there is no separate wall-polygon drawing tool.

For multi-product routing, resolve unique shelf stops, repeatedly choose the nearest reachable shelf by shortest graph distance, then append checkout. No 2-opt improvement or global-optimum claim. Unreachable stops fail explicitly; the UI does not draw a fabricated direct connection. Distances are arbitrary units unless the owner calibrates a scale.

## Server routes

- `GET /api/stores/[slug]`: published map only, no-store.
- `GET /api/stores/[slug]/products?q=`: published search results + shelf summary.
- `POST /api/routes`: validate IDs and compute canonical route against published data.
- `POST /api/admin/login`, `DELETE /api/admin/login`: local owner sign-in/out.
- `GET/PUT /api/admin/stores/[slug]/draft`: authenticated read/save with revision checking.
- `POST /api/admin/stores/[slug]/publish`: authenticated same-origin validated atomic publication.

Errors contain `{code,message,details?}` and HTTP 401/403/404/409/422/503 as applicable. Shape validation occurs at the API boundary. Credentials and mutable runtime state are ignored by Git. Arbitrary external image URLs are rejected, and there is no URL proxy.

## Acceptance evidence

Automated checks cover AC-01 through AC-09: fixture/search, graph-constrained routes, blocked detours, disconnected stops, deduplicated shopping lists and checkout, known/unknown checkpoints, private draft relocation, publication and invalid-publication preservation, unauthorized reads/mutations and cross-origin denial. The browser journey checks owner relocation A1→B2, unchanged customer data before publication, saved-draft preview, publication, a three-product route, QR PNG, stale save and 375px layout. Test fixture data is isolated from the actual demo.

AC-10: responsive browser layout is tested at 375px without horizontal page overflow. Labelled controls, visible focus, object-picker/numeric editing and text directions provide keyboard alternatives. Physical-device QR scanning, actual touch gestures and a full screen-reader audit are **manual checks still to perform**.

AC-11: lint, strict TypeScript, unit/integration tests and production build are run locally and in CI. Local seeded timings are measured as a development check, not a field benchmark or promise on all devices.

## Deliberate limits and deviations

- Single seeded demo store; store identity cannot be changed through the editor. Multi-store creation/tenancy is excluded.
- Shelves are axis-aligned rectangles. No rotated polygons, floor-plan image import, automatic aisle inference or AI shelf OCR.
- Shelf access-node assignment must be a geometrically nearest candidate outside shelf interiors. Walkability/reachability are validated; real-world shelf-face accessibility remains an owner-maintained fact.
- Alias/stock editing and QR PNG generation are included. CSV import/export, undo/history, image upload, usage analytics, POS sync and semantic/voice search are deferred.
- No live indoor location, live stock feed, accessibility routing, duration estimates or automatic position updates after collecting a product.
- Customer refresh is explicit, not live push. Shopping lists are browser-local; store snapshots are server-owned.
- Mobile uses stacked shopping-list/directions panels rather than a modal bottom sheet. Search remains pinned when scrolling, and the map supports zoom/pan with text directions below it.
- JSON writes are atomic and revision checked within a single Node process. Production multi-process storage/authentication requires additional work.

## Vendor references checked

[Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route), [cookies](https://nextjs.org/docs/app/api-reference/functions/cookies), and [Zod schema APIs](https://zod.dev/api). Dependencies are locked in package-lock.json. The source BRD itself is not included in the public repository.

## Release checks on 25 October 2026

26 unit/integration checks passed. The production build, lint and strict TypeScript checks passed. Browser/API checks cover the complete owner/customer journey, protected preview, pointer dragging, keyboard/numeric editing, edge blocking controls, draft isolation, publication, QR generation, 375px layout and failure cases. Physical-phone QR scanning, touch-pinch on real devices and a full assistive-technology audit are not claimed as completed. Example seeded development timings were under 1ms for search and approximately 1–4ms for a three-product route; these are local measurements, not field performance guarantees.
