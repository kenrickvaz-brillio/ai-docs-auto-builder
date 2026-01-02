import seedrandom from 'seedrandom';
import commitsData from '../mock-data/commits.json';
import apisData from '../mock-data/apis.json';
import modulesData from '../mock-data/modules.json';
import diagramData from '../mock-data/diagram.json';

export interface GenerationInput {
    projectId: string;
    selectedSources: string[];
    selectedCommitIds: string[];
    docTypes: string[];
    tone: 'concise' | 'standard' | 'detailed';
    audience: 'dev' | 'ops' | 'product';
}

export function generateHash(input: GenerationInput): string {
    const str = JSON.stringify(input);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

export function simulateGeneration(input: GenerationInput) {
    const hash = generateHash(input);
    const rng = seedrandom(hash);

    const results: any[] = [];

    if (input.docTypes.includes('architecture')) {
        results.push({
            type: 'architecture',
            title: 'Architecture Overview',
            content: generateArchitectureDoc(input, rng)
        });
    }

    if (input.docTypes.includes('api')) {
        results.push({
            type: 'api',
            title: 'API Documentation',
            content: generateApiDoc(input, rng)
        });
    }

    if (input.docTypes.includes('onboarding')) {
        results.push({
            type: 'onboarding',
            title: 'Onboarding Guide',
            content: generateOnboardingDoc(input, rng)
        });
    }

    return results;
}

function generateArchitectureDoc(input: GenerationInput, rng: seedrandom.PRNG) {
    const selectedCommits = commitsData.filter(c => input.selectedCommitIds.includes(c.id));
    const modules = modulesData;

    return {
        overview: `The Hotel Audits Mobile project is a robust, offline-first application designed for hotel inspectors. This architecture focuses on ${input.tone === 'concise' ? 'efficiency' : 'reliability and scalability'}.`,
        components: modules.map(m => ({
            ...m,
            status: rng() > 0.8 ? 'Needs Update' : 'Stable'
        })),
        dataFlows: [
            "User initiates audit -> Scan Engine captures data",
            "Scan Engine -> Local SQLite storage",
            "Sync Engine -> Backend API (when online)",
            "Auth Module -> Identity Provider"
        ],
        risks: [
            "Offline data consistency during multi-device sync",
            "OCR accuracy in low-light environments",
            "Biometric fallback mechanisms"
        ],
        diagram: diagramData
    };
}

function generateApiDoc(input: GenerationInput, rng: seedrandom.PRNG) {
    return {
        authentication: "All API requests require a Bearer token in the Authorization header, except for the login endpoint.",
        endpoints: apisData.map(api => ({
            ...api,
            deprecated: rng() > 0.9
        })),
        errorCodes: [
            { code: 400, message: "Bad Request" },
            { code: 401, message: "Unauthorized" },
            { code: 403, message: "Forbidden" },
            { code: 404, message: "Not Found" },
            { code: 500, message: "Internal Server Error" }
        ]
    };
}

function generateOnboardingDoc(input: GenerationInput, rng: seedrandom.PRNG) {
    const troubleshooting = commitsData
        .filter(c => c.message.startsWith('fix:'))
        .slice(0, 3)
        .map(c => ({
            issue: c.message.replace('fix: ', ''),
            solution: "Refer to commit " + c.id + " for implementation details."
        }));

    return {
        prerequisites: [
            "Node.js v18+",
            "React Native CLI",
            "Android Studio / Xcode",
            "SQLite Viewer"
        ],
        setupSteps: [
            "Clone the repository",
            "Run `npm install`",
            "Configure `.env` with API endpoints",
            "Run `npx react-native run-ios` or `run-android`"
        ],
        troubleshooting
    };
}
