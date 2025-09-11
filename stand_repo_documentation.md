# Stand repo documentation (vincent_dev_test)

## Repository tree

```
- Stand-vincent_dev_test/
  - .gitignore
  - README.md
  - eslint.config.js
  - index.html
  - package-lock.json
  - package.json
  - readme.md
  - tailwind.config.js
  - tsconfig.app.json
  - tsconfig.json
  - tsconfig.node.json
  - vite.config.ts
  - public/
    - Thumbs.db
    - liser_logo.png
    - vite.svg
  - scripts/
    - build_json.py
  - src/
    - App.css
    - App.tsx
    - index.css
    - main.tsx
    - vite-env.d.ts
    - assets/
      - react.svg
      - animations/
        - attract.json
        - sandy_loading.json
        - stageEnter.json
    - components/
      - DomainButtons.tsx
      - GraphPanel.tsx
      - Header.tsx
      - StageNav.tsx
    - data/
      - blurbs.json
      - domains.json
      - graph.json
      - lifeStages.json
      - questions.json
    - pages/
      - AttractScreen.tsx
      - DomainScreen.tsx
      - QuestionScreen.tsx
      - StageScreen.tsx
```

## Entry-like files

- `Stand-vincent_dev_test/eslint.config.js`
- `Stand-vincent_dev_test/index.html`
- `Stand-vincent_dev_test/src/main.tsx`
- `Stand-vincent_dev_test/src/vite-env.d.ts`
- `Stand-vincent_dev_test/tailwind.config.js`
- `Stand-vincent_dev_test/vite.config.ts`

## Dependency highlights

**Most depended-on files:**
- `Stand-vincent_dev_test/src/data/lifeStages.json` used by 5 files
- `Stand-vincent_dev_test/src/data/domains.json` used by 3 files
- `Stand-vincent_dev_test/src/pages/DomainScreen.tsx` used by 1 files
- `Stand-vincent_dev_test/src/pages/AttractScreen.tsx` used by 1 files
- `Stand-vincent_dev_test/src/pages/StageScreen.tsx` used by 1 files
- `Stand-vincent_dev_test/src/pages/QuestionScreen.tsx` used by 1 files
- `Stand-vincent_dev_test/src/components/Header.tsx` used by 1 files
- `Stand-vincent_dev_test/src/App.tsx` used by 1 files
- `Stand-vincent_dev_test/src/index.css` used by 1 files
- `Stand-vincent_dev_test/src/data/graph.json` used by 1 files
- `Stand-vincent_dev_test/src/assets/animations/sandy_loading.json` used by 1 files
- `Stand-vincent_dev_test/src/data/blurbs.json` used by 1 files
- `Stand-vincent_dev_test/src/components/GraphPanel.tsx` used by 1 files
- `Stand-vincent_dev_test/src/data/questions.json` used by 1 files
- `Stand-vincent_dev_test/src/components/StageNav.tsx` used by 1 files

**Files with most direct dependencies:**
- `Stand-vincent_dev_test/src/App.tsx` depends on 7 files
- `Stand-vincent_dev_test/src/pages/DomainScreen.tsx` depends on 3 files
- `Stand-vincent_dev_test/src/pages/QuestionScreen.tsx` depends on 3 files
- `Stand-vincent_dev_test/src/main.tsx` depends on 2 files
- `Stand-vincent_dev_test/src/components/DomainButtons.tsx` depends on 2 files
- `Stand-vincent_dev_test/src/pages/StageScreen.tsx` depends on 2 files
- `Stand-vincent_dev_test/src/components/GraphPanel.tsx` depends on 1 files
- `Stand-vincent_dev_test/src/components/StageNav.tsx` depends on 1 files
- `Stand-vincent_dev_test/src/pages/AttractScreen.tsx` depends on 1 files

## File-by-file summary

### `Stand-vincent_dev_test/.gitignore`

- Binary or non-parsed file.

### `Stand-vincent_dev_test/README.md`

- Markdown content.
- Imports: eslint-plugin-react-dom, eslint-plugin-react-x

### `Stand-vincent_dev_test/eslint.config.js`

- Imports: @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, eslint/config, globals, typescript-eslint

### `Stand-vincent_dev_test/index.html`

- Binary or non-parsed file.

### `Stand-vincent_dev_test/package-lock.json`

- Data or config JSON.

### `Stand-vincent_dev_test/package.json`

- Data or config JSON.

### `Stand-vincent_dev_test/public/Thumbs.db`

- Binary or non-parsed file.

### `Stand-vincent_dev_test/public/liser_logo.png`

- Binary or non-parsed file.

### `Stand-vincent_dev_test/public/vite.svg`

- Binary or non-parsed file.

### `Stand-vincent_dev_test/readme.md`

- Markdown content.

### `Stand-vincent_dev_test/scripts/build_json.py`

- Binary or non-parsed file.

### `Stand-vincent_dev_test/src/App.css`

- Stylesheet.

### `Stand-vincent_dev_test/src/App.tsx`

- React component `App`.
- Imports: Stand-vincent_dev_test/src/components/Header, Stand-vincent_dev_test/src/data/domains.json, Stand-vincent_dev_test/src/data/lifeStages.json, Stand-vincent_dev_test/src/pages/AttractScreen, Stand-vincent_dev_test/src/pages/DomainScreen, Stand-vincent_dev_test/src/pages/QuestionScreen, Stand-vincent_dev_test/src/pages/StageScreen, framer-motion, react
- Depends on: Stand-vincent_dev_test/src/components/Header.tsx, Stand-vincent_dev_test/src/data/domains.json, Stand-vincent_dev_test/src/data/lifeStages.json, Stand-vincent_dev_test/src/pages/AttractScreen.tsx, Stand-vincent_dev_test/src/pages/DomainScreen.tsx, Stand-vincent_dev_test/src/pages/QuestionScreen.tsx, Stand-vincent_dev_test/src/pages/StageScreen.tsx
- Used by: Stand-vincent_dev_test/src/main.tsx

### `Stand-vincent_dev_test/src/assets/animations/attract.json`

- Data or config JSON.

### `Stand-vincent_dev_test/src/assets/animations/sandy_loading.json`

- Data or config JSON.
- Used by: Stand-vincent_dev_test/src/pages/AttractScreen.tsx

### `Stand-vincent_dev_test/src/assets/animations/stageEnter.json`

- Data or config JSON.

### `Stand-vincent_dev_test/src/assets/react.svg`

- Binary or non-parsed file.

### `Stand-vincent_dev_test/src/components/DomainButtons.tsx`

- React component file.
- Imports: Stand-vincent_dev_test/src/data/domains.json, Stand-vincent_dev_test/src/data/lifeStages.json, framer-motion, react
- Depends on: Stand-vincent_dev_test/src/data/domains.json, Stand-vincent_dev_test/src/data/lifeStages.json
- Used by: Stand-vincent_dev_test/src/pages/StageScreen.tsx

### `Stand-vincent_dev_test/src/components/GraphPanel.tsx`

- React component file.
- Imports: Stand-vincent_dev_test/src/data/graph.json, cytoscape, react
- Depends on: Stand-vincent_dev_test/src/data/graph.json
- Used by: Stand-vincent_dev_test/src/pages/DomainScreen.tsx

### `Stand-vincent_dev_test/src/components/Header.tsx`

- React component file.
- Imports: react
- Used by: Stand-vincent_dev_test/src/App.tsx

### `Stand-vincent_dev_test/src/components/StageNav.tsx`

- React component file.
- Imports: Stand-vincent_dev_test/src/data/lifeStages.json, framer-motion, react
- Exports: StageNav
- Depends on: Stand-vincent_dev_test/src/data/lifeStages.json
- Used by: Stand-vincent_dev_test/src/pages/StageScreen.tsx

### `Stand-vincent_dev_test/src/data/blurbs.json`

- Data or config JSON.
- Used by: Stand-vincent_dev_test/src/pages/DomainScreen.tsx

### `Stand-vincent_dev_test/src/data/domains.json`

- Data or config JSON.
- Used by: Stand-vincent_dev_test/src/App.tsx, Stand-vincent_dev_test/src/components/DomainButtons.tsx, Stand-vincent_dev_test/src/pages/QuestionScreen.tsx

### `Stand-vincent_dev_test/src/data/graph.json`

- Data or config JSON.
- Used by: Stand-vincent_dev_test/src/components/GraphPanel.tsx

### `Stand-vincent_dev_test/src/data/lifeStages.json`

- Data or config JSON.
- Used by: Stand-vincent_dev_test/src/App.tsx, Stand-vincent_dev_test/src/components/DomainButtons.tsx, Stand-vincent_dev_test/src/components/StageNav.tsx, Stand-vincent_dev_test/src/pages/DomainScreen.tsx, Stand-vincent_dev_test/src/pages/QuestionScreen.tsx

### `Stand-vincent_dev_test/src/data/questions.json`

- Data or config JSON.
- Used by: Stand-vincent_dev_test/src/pages/QuestionScreen.tsx

### `Stand-vincent_dev_test/src/index.css`

- Stylesheet.
- Used by: Stand-vincent_dev_test/src/main.tsx

### `Stand-vincent_dev_test/src/main.tsx`

- React component file.
- Imports: Stand-vincent_dev_test/src/App.tsx, Stand-vincent_dev_test/src/index.css, react, react-dom/client
- Depends on: Stand-vincent_dev_test/src/App.tsx, Stand-vincent_dev_test/src/index.css

### `Stand-vincent_dev_test/src/pages/AttractScreen.tsx`

- React component file.
- Imports: Stand-vincent_dev_test/src/assets/animations/sandy_loading.json, framer-motion, lottie-react, react
- Depends on: Stand-vincent_dev_test/src/assets/animations/sandy_loading.json
- Used by: Stand-vincent_dev_test/src/App.tsx

### `Stand-vincent_dev_test/src/pages/DomainScreen.tsx`

- Imports: Stand-vincent_dev_test/src/components/GraphPanel, Stand-vincent_dev_test/src/data/blurbs.json, Stand-vincent_dev_test/src/data/lifeStages.json, framer-motion
- Depends on: Stand-vincent_dev_test/src/components/GraphPanel.tsx, Stand-vincent_dev_test/src/data/blurbs.json, Stand-vincent_dev_test/src/data/lifeStages.json
- Used by: Stand-vincent_dev_test/src/App.tsx

### `Stand-vincent_dev_test/src/pages/QuestionScreen.tsx`

- React component file.
- Imports: Stand-vincent_dev_test/src/data/domains.json, Stand-vincent_dev_test/src/data/lifeStages.json, Stand-vincent_dev_test/src/data/questions.json, framer-motion, react
- Depends on: Stand-vincent_dev_test/src/data/domains.json, Stand-vincent_dev_test/src/data/lifeStages.json, Stand-vincent_dev_test/src/data/questions.json
- Used by: Stand-vincent_dev_test/src/App.tsx

### `Stand-vincent_dev_test/src/pages/StageScreen.tsx`

- React component file.
- Imports: Stand-vincent_dev_test/src/components/DomainButtons, Stand-vincent_dev_test/src/components/StageNav, react
- Depends on: Stand-vincent_dev_test/src/components/DomainButtons.tsx, Stand-vincent_dev_test/src/components/StageNav.tsx
- Used by: Stand-vincent_dev_test/src/App.tsx

### `Stand-vincent_dev_test/src/vite-env.d.ts`

- Binary or non-parsed file.

### `Stand-vincent_dev_test/tailwind.config.js`

- Configuration module.

### `Stand-vincent_dev_test/tsconfig.app.json`

- Data or config JSON.

### `Stand-vincent_dev_test/tsconfig.json`

- Data or config JSON.

### `Stand-vincent_dev_test/tsconfig.node.json`

- Data or config JSON.

### `Stand-vincent_dev_test/vite.config.ts`

- Imports: @tailwindcss/vite, @vitejs/plugin-react, vite
