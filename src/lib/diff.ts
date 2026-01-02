import { GeneratedDoc } from './storage';

export interface DiffResult {
    addedEndpoints: string[];
    removedEndpoints: string[];
    newModules: string[];
    notableChanges: string[];
}

export function computeDiff(oldDoc: GeneratedDoc | undefined, newDoc: GeneratedDoc): DiffResult {
    const result: DiffResult = {
        addedEndpoints: [],
        removedEndpoints: [],
        newModules: [],
        notableChanges: []
    };

    if (!oldDoc) {
        result.notableChanges.push("Initial generation");
        return result;
    }

    if (newDoc.type === 'api' && oldDoc.type === 'api') {
        const oldPaths = oldDoc.content.endpoints.map((e: any) => e.path);
        const newPaths = newDoc.content.endpoints.map((e: any) => e.path);

        result.addedEndpoints = newPaths.filter((p: string) => !oldPaths.includes(p));
        result.removedEndpoints = oldPaths.filter((p: string) => !newPaths.includes(p));
    }

    if (newDoc.type === 'architecture' && oldDoc.type === 'architecture') {
        const oldModules = oldDoc.content.components.map((m: any) => m.name);
        const newModules = newDoc.content.components.map((m: any) => m.name);

        result.newModules = newModules.filter((m: string) => !oldModules.includes(m));
    }

    // Simulate some changes based on inputsHash if they are different
    if (oldDoc.inputsHash !== newDoc.inputsHash) {
        result.notableChanges.push("Updated based on new source data");
        if (newDoc.selectedSources.length > oldDoc.selectedSources.length) {
            result.notableChanges.push("Added more data sources for analysis");
        }
    }

    return result;
}
