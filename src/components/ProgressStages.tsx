"use client";

import { Check, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Stage {
    id: string;
    label: string;
    status: 'pending' | 'loading' | 'completed';
}

export default function ProgressStages({ stages }: { stages: Stage[] }) {
    return (
        <div className="space-y-6">
            {stages.map((stage, i) => (
                <div key={stage.id} className="flex items-center gap-4">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                        stage.status === 'completed' ? "bg-emerald-500 text-white" :
                            stage.status === 'loading' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" :
                                "bg-slate-100 text-slate-400"
                    )}>
                        {stage.status === 'completed' ? (
                            <Check className="w-5 h-5" />
                        ) : stage.status === 'loading' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="text-sm font-bold">{i + 1}</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className={cn(
                            "text-sm font-semibold transition-colors",
                            stage.status === 'pending' ? "text-slate-400" : "text-slate-900"
                        )}>
                            {stage.label}
                        </p>
                        {stage.status === 'loading' && (
                            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 animate-progress-indeterminate"></div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
