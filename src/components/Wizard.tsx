"use client";

import { useState, useEffect } from 'react';
import {
    Code2,
    GitCommit,
    GitPullRequest,
    FileText,
    Users,
    MessageSquare,
    ArrowRight,
    ArrowLeft,
    Check,
    Wand2,
    AlertCircle
} from 'lucide-react';
import { Card } from '@/components/Cards';
import ProgressStages from './ProgressStages';
import { simulateGeneration, generateHash } from '@/lib/simulator';
import { storage } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import commits from '@/mock-data/commits.json';
import prs from '@/mock-data/prs.json';
import repoTree from '@/mock-data/repoTree.json';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const STEPS = [
    { id: 'sources', title: 'Select Sources', description: 'Choose what data to analyze' },
    { id: 'types', title: 'Doc Types', description: 'What should we build?' },
    { id: 'config', title: 'Configure', description: 'Tone and audience' },
    { id: 'preview', title: 'Preview', description: 'Review inputs' },
    { id: 'generate', title: 'Generate', description: 'AI Magic' },
];

export default function Wizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [stages, setStages] = useState<{ id: string, label: string, status: 'pending' | 'loading' | 'completed' }[]>([
        { id: 'index', label: 'Indexing repository…', status: 'pending' },
        { id: 'parse', label: 'Parsing commits…', status: 'pending' },
        { id: 'derive', label: 'Deriving components…', status: 'pending' },
        { id: 'write', label: 'Writing sections…', status: 'pending' },
        { id: 'finalize', label: 'Finalizing…', status: 'pending' },
    ]);

    const [formData, setFormData] = useState({
        sources: ['code', 'commits', 'prs'],
        docTypes: ['architecture', 'api'],
        tone: 'standard' as 'concise' | 'standard' | 'detailed',
        audience: 'dev' as 'dev' | 'ops' | 'product',
        selectedCommits: commits.slice(0, 5).map(c => c.id),
    });

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const startGeneration = async () => {
        setIsGenerating(true);
        setCurrentStep(4); // Move to generate step

        const stageTimes = [1500, 2000, 1500, 2500, 1000];

        for (let i = 0; i < stages.length; i++) {
            setStages(prev => prev.map((s, idx) =>
                idx === i ? { ...s, status: 'loading' } : s
            ));

            await new Promise(resolve => setTimeout(resolve, stageTimes[i]));

            setStages(prev => prev.map((s, idx) =>
                idx === i ? { ...s, status: 'completed' } : s
            ));
            setGenerationProgress(((i + 1) / stages.length) * 100);
        }

        // Actual generation
        const input = {
            projectId: 'hotel-audits-mobile',
            selectedSources: formData.sources,
            selectedCommitIds: formData.selectedCommits,
            docTypes: formData.docTypes,
            tone: formData.tone,
            audience: formData.audience
        };

        const results = simulateGeneration(input);
        const hash = generateHash(input);
        const timestamp = new Date().toISOString();

        results.forEach((res, idx) => {
            storage.saveDoc({
                id: `doc-${hash}-${idx}`,
                title: res.title,
                type: res.type,
                createdAt: timestamp,
                versionTag: `v0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
                selectedSources: formData.sources,
                inputsHash: hash,
                content: res.content
            });
        });

        setTimeout(() => {
            router.push('/library');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                {STEPS.map((step, i) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                            i < currentStep ? "bg-emerald-500 text-white" :
                                i === currentStep ? "bg-indigo-600 text-white ring-4 ring-indigo-100" :
                                    "bg-white border-2 border-slate-200 text-slate-400"
                        )}>
                            {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
                        </div>
                        <span className={cn(
                            "absolute -bottom-7 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                            i === currentStep ? "text-indigo-600" : "text-slate-400"
                        )}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            <Card className="min-h-[500px] flex flex-col">
                <div className="flex-1">
                    {currentStep === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Select Data Sources</h2>
                                <p className="text-slate-500 mt-1">Which parts of the repository should the AI analyze?</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'code', label: 'Source Code', icon: Code2, desc: 'Analyze file structure and logic' },
                                    { id: 'commits', label: 'Commits', icon: GitCommit, desc: 'Understand evolution and fixes' },
                                    { id: 'prs', label: 'PR Titles', icon: GitPullRequest, desc: 'Context from feature requests' },
                                ].map((source) => (
                                    <label
                                        key={source.id}
                                        className={cn(
                                            "p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-4 group",
                                            formData.sources.includes(source.id)
                                                ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                                                : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.sources.includes(source.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setFormData({ ...formData, sources: [...formData.sources, source.id] });
                                                else setFormData({ ...formData, sources: formData.sources.filter(s => s !== source.id) });
                                            }}
                                        />
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                            formData.sources.includes(source.id) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                        )}>
                                            <source.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{source.label}</p>
                                            <p className="text-xs text-slate-500 mt-1">{source.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Choose Documentation Types</h2>
                                <p className="text-slate-500 mt-1">What kind of documentation do you need to generate?</p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { id: 'architecture', label: 'Architecture Overview', desc: 'High-level component diagrams and data flows' },
                                    { id: 'api', label: 'API Reference', desc: 'Detailed endpoint documentation and schemas' },
                                    { id: 'onboarding', label: 'Onboarding Guide', desc: 'Setup instructions and troubleshooting' },
                                ].map((type) => (
                                    <label
                                        key={type.id}
                                        className={cn(
                                            "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4",
                                            formData.docTypes.includes(type.id)
                                                ? "border-indigo-600 bg-indigo-50/50"
                                                : "border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.docTypes.includes(type.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setFormData({ ...formData, docTypes: [...formData.docTypes, type.id] });
                                                else setFormData({ ...formData, docTypes: formData.docTypes.filter(t => t !== type.id) });
                                            }}
                                        />
                                        <div className={cn(
                                            "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                                            formData.docTypes.includes(type.id) ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                                        )}>
                                            {formData.docTypes.includes(type.id) && <Check className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{type.label}</p>
                                            <p className="text-xs text-slate-500">{type.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Configuration</h2>
                                <p className="text-slate-500 mt-1">Fine-tune the output style and target audience.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-3">Tone & Detail Level</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['concise', 'standard', 'detailed'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setFormData({ ...formData, tone: t as any })}
                                                className={cn(
                                                    "py-3 px-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all",
                                                    formData.tone === t ? "border-indigo-600 bg-indigo-600 text-white shadow-md" : "border-slate-100 text-slate-500 hover:border-slate-200"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-3">Target Audience</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'dev', label: 'Developers', icon: Code2 },
                                            { id: 'ops', label: 'DevOps/SRE', icon: Users },
                                            { id: 'product', label: 'Product', icon: MessageSquare },
                                        ].map((a) => (
                                            <button
                                                key={a.id}
                                                onClick={() => setFormData({ ...formData, audience: a.id as any })}
                                                className={cn(
                                                    "py-4 px-4 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-2",
                                                    formData.audience === a.id ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 text-slate-500 hover:border-slate-200"
                                                )}
                                            >
                                                <a.icon className="w-5 h-5" />
                                                {a.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Preview Inputs</h2>
                                <p className="text-slate-500 mt-1">Review your selections before starting the generation.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sources</p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.sources.map(s => (
                                                <span key={s} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 capitalize">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Doc Types</p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.docTypes.map(t => (
                                                <span key={t} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 capitalize">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Config</p>
                                        <div className="space-y-2">
                                            <p className="text-sm text-slate-600 flex justify-between"><span>Tone:</span> <span className="font-bold text-slate-900 capitalize">{formData.tone}</span></p>
                                            <p className="text-sm text-slate-600 flex justify-between"><span>Audience:</span> <span className="font-bold text-slate-900 capitalize">{formData.audience}</span></p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex gap-3">
                                            <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                                            <p className="text-xs text-indigo-700 leading-relaxed">
                                                Generation is deterministic. Using the same inputs will result in the same documentation output.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="relative">
                                <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 relative z-10">
                                    <Wand2 className="w-12 h-12 animate-pulse" />
                                </div>
                                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Generating Documentation</h2>
                                <p className="text-slate-500 mt-2">Our AI is analyzing your repository and crafting the docs.</p>
                            </div>

                            <div className="w-full max-w-md">
                                <ProgressStages stages={stages} />
                            </div>
                        </div>
                    )}
                </div>

                {!isGenerating && (
                    <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>

                        {currentStep === 3 ? (
                            <button
                                onClick={startGeneration}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/25"
                            >
                                <Wand2 className="w-4 h-4" />
                                Start Generation
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}
