# ShopNav

**Find the product. Follow the aisle.** A working AI Concept Lab POC for product discovery and navigation in a physical hardware store.

Customers search a catalogue, choose a manually confirmed entrance/checkpoint, and follow a graph-constrained route to a shelf. A shopping list visits unique shelf stops and finishes at checkout. Owners edit the map and catalogue in a protected workspace, save a draft, preview it and publish when validation passes.

This release implements the P0 vertical slice from the ShopNav brief. Routing is deterministic, **not AI**, and there is no live indoor positioning. No paid services or API keys are required.

## Run from a fresh clone

Install [Node.js 22.18 or newer](https://nodejs.org/) and Git, then:

```sh
git clone https://github.com/aiconceptlab/shopnav.git
cd shopnav
npm ci
npm run setup
npm run seed
npm run dev
```

- Landing: **http://localhost:3023**
- Customer: **http://localhost:3023/s/demo-hardware**
- Owner: **http://localhost:3023/admin**
- Saved draft preview: **http://localhost:3023/admin/preview** (owner session required)

`setup` creates a random owner password and session secret in ignored `.env.local`. Open that file locally to obtain `ADMIN_PASSWORD`; enter it in the owner sign-in form. Do not put it in a public issue, screenshot, source commit or chat. An existing `.env.local` is preserved. Restart the server after changing environment variables.

`seed` initializes the deterministic demo if needed and preserves existing edits. To deliberately replace this local store with fresh demo data:

```sh
npm run seed -- --reset --confirm
```

Production build and local start:

```sh
npm run build
npm start
```

## Try the complete customer journey

1. Open the customer view. Search **M8 bolts**; the seed places it at **Shelf A1 / Aisle 1**. Partial matches, SKU, aliases and a one-edit typo in words of at least four characters are supported.
2. Choose **Find →**. The route starts at the selected entrance/checkpoint, follows connected walkways and ends at the shelf's access node. Text directions accompany the map.
3. Add **M8 bolts**, **paint brush** and **wall plugs** to the list. Choose **Navigate list → checkout**. Stops on the same shelf are deduplicated. Deterministic nearest-neighbour ordering is a heuristic, not a globally optimal tour.
4. Select a different confirmed start, or open `/s/demo-hardware?start=cp-aisle-2`. Other seeded checkpoints: `cp-aisle-4`, `cp-aisle-6`. An unknown checkpoint falls back to the entrance with an explanation.
5. Mark an item collected, confirm your actual checkpoint in the selector and recalculate. The app does not infer where you walked. Lists are stored in that browser's localStorage; shared store data is server-owned.

Distances use **map units**, unless an owner enters a calibrated **metres per unit** scale. There are no walking-time, live-stock or accessibility claims. Stock is manually maintained; unknown/unavailable states are explicit.

## Owner workflow

The seeded map includes **6 aisles, 12 rectangular shelves, 36 products, 32 path nodes, entrance, checkout and 3 checkpoints**, with multiple cross-aisle alternatives.

- Select/drag a shelf or node; pan the background; use wheel/pinch, zoom, reset and fit controls. Snap-to-grid can be disabled. The **Select an object** dropdown and numeric inspector fields offer keyboard alternatives to selecting/dragging map objects.
- Add/delete shelf rectangles or path nodes. Use the **From / To** selectors to connect nodes. Select an edge and mark it blocked. Entrance/checkout/checkpoint roles are editable in the node inspector; assigning a new entrance/checkout changes the previous one to a walkway.
- Explicitly select a shelf's walkable access node. Publication requires a geometrically nearest candidate outside shelf interiors; equal-distance candidates are allowed. The route ends at that node, not inside the shelf. The retailer must still verify the correct accessible shelf face and real-world walkability.
- Edit map dimensions, labels and optional scale. Products support create, edit, delete, category, aliases, stock and primary shelf assignment. IDs are stable; SKU uniqueness is checked case-insensitively at publication. Optional image data accepts local `/images/` asset paths only; the P0 UI uses category icons rather than an image upload tool.
- **Save draft** persists a new draft revision. Drafts may contain incomplete graph references while editing, but schema-invalid data cannot be saved. Customers continue seeing the last valid published snapshot. Preview reads the **saved draft**; save your edits before previewing.
- **Publish** is available after saving and passing checks. Server validation rejects shelf overlap, out-of-bounds objects, missing references, zero-length edges, edges crossing shelf interiors, missing entrance/checkout, duplicate SKUs, unreachable assigned shelves and unreachable checkout. Publication writes a complete snapshot atomically.
- A stale save or publish is rejected with HTTP 409. Reload the draft before reconciling your changes; the app does not silently merge two owners' edits.

Customer data refreshes on page refresh or **Refresh map ↻**; this POC does not push updates to already open customer pages. Routes are invalidated when list/start or loaded map changes.

## QR codes and a phone

In the owner inspector, choose the entrance/checkpoint, set **Customer base URL**, and generate/download a PNG. To use a phone, the URL must be reachable from that phone: for example `http://YOUR-PC-LAN-IP:3023`, with both devices on the same network. **localhost/127.0.0.1 on a phone means the phone itself**, so a QR containing it will not reach your computer. The server binds `0.0.0.0` for LAN preview; a Windows firewall rule may be needed for Node on your private network. No firewall setting is changed automatically.

Set optional `NEXT_PUBLIC_CUSTOMER_ORIGIN` before starting/building to prefill a reachable base URL. No camera or geolocation permission is requested by the app. Scan the QR using the phone's normal camera. Physical phone scanning and touch gestures still require validation on actual devices.

## Storage and authentication

The authoritative store is `data/state.json`, or `DATA_DIR/state.json` if configured. Draft and published snapshots live in **one atomically replaced file**, with an in-process lock and optimistic revision checks. A corrupt file produces an error and is not silently overwritten. Back up this directory before real use.

Owner APIs enforce a signed, expiring HttpOnly/SameSite cookie on the server. Mutations also require a matching Origin/Host. Passwords are never shipped in client code. Public APIs return only published map data; public routing does not mutate it. The private preview fetches its draft only after authorization. Login has a small global per-process attempt limit, appropriate for a single-owner demo, not production identity.

Run **one Node process on persistent storage**. This JSON adapter is **not** safe for multiple independent processes, serverless ephemeral filesystems or free hosting tiers without a durable disk. A provider's free allowance does not guarantee persistent storage. For a multi-instance deployment, replace `lib/repository.ts` with SQLite/Postgres transactional storage and proper owner identity. Use HTTPS and review proxy/cookie settings before exposing an owner workspace on the public internet. The current build is a local/LAN POC, not a hosted SaaS release.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:browser
```

If Playwright's Chromium is missing, run `npx playwright install chromium`. Browser checks start a separate production server on **31223**, use a temporary data directory and a temporary owner secret, and stop that test server afterwards. They do not change your working demo store. Node tests also use temporary stores.

See [BUILD.md](BUILD.md) for implementation choices, acceptance evidence and limits. [marketing/README.md](marketing/README.md) describes the five **1080×1350 (4:5)** slides, caption and reel shot list. Source is MIT licensed.
