export interface GeneratedDoc {
    id: string;
    title: string;
    type: 'architecture' | 'api' | 'onboarding';
    createdAt: string;
    versionTag: string;
    selectedSources: string[];
    inputsHash: string;
    content: any;
}

const STORAGE_KEY = 'ai_docs_auto_builder_docs';

export const storage = {
    getDocs: (): GeneratedDoc[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    saveDoc: (doc: GeneratedDoc) => {
        const docs = storage.getDocs();
        const existingIndex = docs.findIndex(d => d.id === doc.id);
        if (existingIndex > -1) {
            docs[existingIndex] = doc;
        } else {
            docs.push(doc);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    },

    deleteDoc: (id: string) => {
        const docs = storage.getDocs();
        const filtered = docs.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    getDocById: (id: string): GeneratedDoc | undefined => {
        return storage.getDocs().find(d => d.id === id);
    },

    getLatestDocByType: (type: string): GeneratedDoc | undefined => {
        return storage.getDocs()
            .filter(d => d.type === type)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    }
};
