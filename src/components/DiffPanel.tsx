"use client";

import { DiffResult } from '@/lib/diff';
import { Plus, Minus, Info, GitCommit } from 'lucide-react';

export default function DiffPanel({ diff }: { diff: DiffResult }) {
    const hasChanges = diff.addedEndpoints.length > 0 ||
        diff.removedEndpoints.length > 0 ||
        diff.newModules.length > 0 ||
        diff.notableChanges.length > 0;

    if (!hasChanges) {
        return (
            <div className="p-6 text-center">
                <p className="text-slate-500 text-sm">No significant changes detected since the last version.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {diff.newModules.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Plus className="w-3 h-3 text-emerald-500" />
                        New Modules
                    </h4>
                    <div className="space-y-2">
                        {diff.newModules.map((m, i) => (
                            <div key={i} className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
                                {m}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {diff.addedEndpoints.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Plus className="w-3 h-3 text-emerald-500" />
                        Added Endpoints
                    </h4>
                    <div className="space-y-2">
                        {diff.addedEndpoints.map((e, i) => (
                            <div key={i} className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-mono border border-emerald-100">
                                {e}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {diff.removedEndpoints.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Minus className="w-3 h-3 text-rose-500" />
                        Removed Endpoints
                    </h4>
                    <div className="space-y-2">
                        {diff.removedEndpoints.map((e, i) => (
                            <div key={i} className="px-3 py-2 bg-rose-50 text-rose-700 rounded-lg text-sm font-mono border border-rose-100">
                                {e}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {diff.notableChanges.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Info className="w-3 h-3 text-indigo-500" />
                        Notable Changes
                    </h4>
                    <div className="space-y-2">
                        {diff.notableChanges.map((c, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                                <p className="text-sm text-slate-600">{c}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
