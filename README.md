# AI Documentation Auto-Builder (Static Demo)

A polished, deterministic static demo of an AI-powered documentation builder. This application simulates the entire flow of analyzing a repository and generating structured documentation without any real backend or LLM calls.

## Features
- **Deterministic Generation**: Same inputs (sources, commits, config) always produce the same documentation output using seeded pseudo-randomness.
- **Multi-Step Wizard**: A realistic 5-step generation flow with staged progress animations.
- **Rich Doc Viewer**: Specialized rendering for Architecture, API, and Onboarding docs.
- **Version Diffing**: Visualizes what changed between the current and previous generation.
- **Mock Repository**: Pre-loaded with data for the "Hotel Audits Mobile" project.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS Keyframes
- **Persistence**: LocalStorage

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## How the Simulation Works

### Determinism
The core logic resides in `src/lib/simulator.ts`. It uses the `seedrandom` library to create a PRNG seeded with a hash of all user inputs. This ensures that if you select the same commits and settings, the "AI" will "decide" on the same phrasing, risks, and highlights every time.

### Mock Data
All repository data is stored as static JSON files in `src/mock-data/`:
- `commits.json`: 15 commits with metadata.
- `apis.json`: 6 API endpoints with schemas.
- `modules.json`: 4 domain modules.
- `repoTree.json`: File structure visualization.
- `prs.json`: Pull request history.

### Diff Engine
The `src/lib/diff.ts` utility compares the current generated doc with the most recent previous doc of the same type stored in `localStorage`. It identifies added/removed endpoints and new modules.

## 60-Second Demo Script

1.  **Dashboard**: Start at `/`. Point out the "75% Documentation Health" and the empty state in "Recent Documentation".
2.  **Sources**: Navigate to `/sources`. Show the "Code Tree", "Commits", and "PRs" tabs to demonstrate the "analyzed" data.
3.  **Generate**: Click "Generate Docs".
    - **Step 1**: Keep defaults (Code, Commits, PRs).
    - **Step 2**: Select all three doc types.
    - **Step 3**: Change Tone to "Detailed" and Audience to "Developers".
    - **Step 4**: Review the preview and note the "Deterministic Mode" alert.
    - **Step 5**: Click "Start Generation". Watch the staged progress (Indexing -> Parsing -> Writing).
4.  **Library**: You'll be redirected to the Library. See the 3 new documents.
5.  **Viewer**: Click "View" on the "Architecture Overview".
    - Scroll through the "Key Components" and "Data Flows".
    - Click "View Changes" to see the "Initial generation" diff.
    - Click "Export" to see the simulated export toast.
6.  **Re-run**: Go back to "Generate", use the *exact same settings*, and show that the resulting docs are identical (same hash).
