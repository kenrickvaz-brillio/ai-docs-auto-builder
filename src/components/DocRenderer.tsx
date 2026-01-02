"use client";

import {
    Shield,
    Box,
    Zap,
    AlertTriangle,
    Code2,
    Lock,
    Server,
    Terminal,
    CheckCircle2,
    HelpCircle,
    ArrowRight
} from 'lucide-react';
import { Card } from '@/components/Cards';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function DocRenderer({ doc }: { doc: any }) {
    const { type, content } = doc;

    if (type === 'architecture') {
        return (
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-indigo-600" />
                        System Overview
                    </h2>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 leading-relaxed">{content.overview}</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Box className="w-6 h-6 text-indigo-600" />
                        Key Components
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.components.map((comp: any, i: number) => (
                            <Card key={i} title={comp.name} subtitle={comp.status} className="border-l-4 border-l-indigo-500">
                                <p className="text-sm text-slate-600 mb-4">{comp.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {comp.dependencies.map((dep: string, j: number) => (
                                        <span key={j} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">
                                            {dep}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-indigo-600" />
                        Data Flows
                    </h2>
                    <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 font-mono text-sm space-y-4">
                        {content.dataFlows.map((flow: string, i: number) => (
                            <div key={i} className="flex items-start gap-4">
                                <span className="text-indigo-400 font-bold">{i + 1}.</span>
                                <p>{flow}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                        Risks & Tradeoffs
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {content.risks.map((risk: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                <p className="text-sm font-medium">{risk}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    if (type === 'api') {
        return (
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Lock className="w-6 h-6 text-indigo-600" />
                        Authentication
                    </h2>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                        <p className="text-indigo-900 text-sm leading-relaxed">{content.authentication}</p>
                        <div className="mt-4 bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300">
                            Authorization: Bearer &lt;your_token&gt;
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Server className="w-6 h-6 text-indigo-600" />
                        Endpoints
                    </h2>
                    <div className="space-y-8">
                        {content.endpoints.map((api: any, i: number) => (
                            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                            api.method === 'GET' ? "bg-blue-100 text-blue-700" :
                                                api.method === 'POST' ? "bg-emerald-100 text-emerald-700" :
                                                    api.method === 'PATCH' ? "bg-amber-100 text-amber-700" :
                                                        "bg-rose-100 text-rose-700"
                                        )}>
                                            {api.method}
                                        </span>
                                        <code className="text-sm font-bold text-slate-900">{api.path}</code>
                                    </div>
                                    {api.auth && <Lock className="w-4 h-4 text-slate-400" />}
                                </div>
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Request Parameters</h4>
                                        <div className="bg-slate-50 rounded-xl p-4 font-mono text-xs text-slate-600">
                                            <pre>{JSON.stringify(api.params, null, 2)}</pre>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Success Response</h4>
                                        <div className="bg-slate-50 rounded-xl p-4 font-mono text-xs text-slate-600">
                                            <pre>{JSON.stringify(api.response, null, 2)}</pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                        Error Codes
                    </h2>
                    <div className="overflow-hidden border border-slate-200 rounded-2xl">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-bold text-slate-700">Code</th>
                                    <th className="px-6 py-3 font-bold text-slate-700">Message</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {content.errorCodes.map((err: any, i: number) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 font-mono text-rose-600 font-bold">{err.code}</td>
                                        <td className="px-6 py-4 text-slate-600">{err.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        );
    }

    if (type === 'onboarding') {
        return (
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-indigo-600" />
                        Prerequisites
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.prerequisites.map((req: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-medium text-slate-700">{req}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-indigo-600" />
                        Setup Steps
                    </h2>
                    <div className="space-y-4">
                        {content.setupSteps.map((step: string, i: number) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-indigo-500/20">
                                        {i + 1}
                                    </div>
                                    {i !== content.setupSteps.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-2"></div>}
                                </div>
                                <div className="pb-8">
                                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm group-hover:border-indigo-200 transition-colors">
                                        <p className="text-slate-700 font-medium">{step}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-amber-500" />
                        Troubleshooting
                    </h2>
                    <div className="space-y-4">
                        {content.troubleshooting.map((item: any, i: number) => (
                            <Card key={i} title={item.issue} className="border-l-4 border-l-amber-500">
                                <div className="flex items-start gap-3 text-slate-600">
                                    <ArrowRight className="w-4 h-4 mt-1 text-amber-500 shrink-0" />
                                    <p className="text-sm leading-relaxed">{item.solution}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    return <div>Unknown document type</div>;
}
