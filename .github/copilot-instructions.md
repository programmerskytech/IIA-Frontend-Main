## Purpose
Provide concise, repo-specific guidance so an AI coding agent can be immediately productive working on this React frontend.

## Big picture
- This is a Create React App frontend (see [README.md](README.md)).
- Dev server: `react-scripts start`; production build output goes to the `build/` folder.
- Main app entry: `src/index.js` mounts `src/App.js` which initializes global state and routes.
- Routing is defined under `src/pages/route/Routes` — changes here affect top-level navigation.

## API & network patterns
- Axios is used for API calls. Default base URL is set in `src/App.js` (look for `axios.defaults.baseURL`).
- Dev proxy: `src/setupProxy.js` rewrites `/api` → `/astro-service/api`. package.json also contains a `proxy` entry; prefer `setupProxy.js` for complex rewrites.
- Typical API usage: slices and components call `axios.get('/api/xxx')` (see `src/store/slice/masterSlice.js`). When changing endpoints, update both `setupProxy.js` and references to `axios.defaults.baseURL` if needed.

## State management
- Redux Toolkit + `redux-persist` are used. Root store: `src/store/index.js` and slices in `src/store/slice/`.
- Pattern: async thunks (createAsyncThunk) are used for API fetches (example: `fetchMasters` in `masterSlice.js`). Update UI by returning structured payloads from thunks.

## Component & project conventions
- Components live in `src/components/`. Many components follow a `DKG_` prefix for design-system primitives (e.g., `DKG_FormInputItem.jsx`, `DKG_Table.jsx`). When adding UI primitives, follow the `DKG_` naming and props patterns.
- Pages grouped under `src/pages/` (accounting, dashboard, masters, reports, etc.). Keep page-level logic in `pages/*` and UI in `components/*`.
- Reusable hooks are in `src/hooks/` (e.g., `useLOVValues.js`). Utilities are under `src/utils/` (`CommonFunctions.js`, `Constants.jsx`). Prefer these helpers over ad-hoc utilities.

## Styling & UI libraries
- UI: Ant Design (`antd`) is the primary component library. Look at existing `DKG_` components for theme/wrapper patterns.
- Tailwind is present as a dev dependency; project mixing Ant Design and Tailwind — follow existing component styles (prefer Ant Design patterns for complex components).

## Build, test, and debug
- Start dev server: `npm start` (uses `react-scripts start`).
- Build: `npm run build` → outputs static site to `build/`.
- Tests: `npm test` (CRA test runner). Unit test coverage is minimal — inspect `src/App.test.js` for examples.
- To debug API issues locally: check `src/App.js` for `axios.defaults.baseURL` and `src/setupProxy.js` for rewrites. Common pitfall: changing `package.json` proxy vs `setupProxy.js`—use `setupProxy.js` if you need pathRewrite.

## Common code patterns & snippets
- API thunk example: see `src/store/slice/masterSlice.js` (parallel `Promise.all` calls, then map/transform responseData into label/value lists).
- Persisted state: `redux-persist` whitelist is in `src/store/index.js`; changes to slice names must be reflected there.
- Global imports: `src/App.js` sets global axios defaults early — other modules assume axios is preconfigured.

## Integration points
- Backend: server base URLs appear at `package.json.proxy` and `src/App.js`. CI/deploy may replace `build/` contents with backend hosting.
- Static assets: `src/assets` and `public/` — uploaded files often handled by custom components `UploadFile.jsx` and `DKG_Vendor_FileUpload.jsx`.

## Where to look first when modifying behavior
- API/Network: `src/App.js`, `src/setupProxy.js`, `src/store/slice/*`.
- Routing/navigation: `src/pages/route/Routes`.
- Global state and persistence: `src/store/index.js` and `src/store/slice/*`.
- Shared UI primitives: `src/components/DKG_*` files.

## Safety & tests
- When adding network behavior, mirror the `fetchMasters` style (error propagation via thrown error in thunk) and update UI loading/error flags.
- Run `npm start` and exercise the pages that depend on `masters` to ensure persisted state and API calls work.

## Examples (copy-paste reference)
- Axios baseURL (src/App.js):
```
export const baseURL = "http://localhost:8081/astro-service";
axios.defaults.baseURL = baseURL;
```
- Proxy rewrite (src/setupProxy.js):
```
pathRewrite: { "^/api": "/astro-service/api" }
```

## Final notes
- Keep changes consistent with existing `DKG_` UI patterns and centralized API configuration.
- If anything in this file is unclear or missing, tell me which area you'd like expanded (routing, store slices, API conventions, or component patterns) and I'll iterate.
