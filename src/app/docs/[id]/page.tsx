"use client";

import { useEffect, useState, use } from 'react';
import { storage, GeneratedDoc } from '@/lib/storage';
import { computeDiff, DiffResult } from '@/lib/diff';
import {
    ArrowLeft,
    Download,
    Share2,
    History,
    CheckCircle2,
    Clock,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import DocRenderer from '@/components/DocRenderer';
import DiffPanel from '@/components/DiffPanel';
import { Card } from '@/components/Cards';

export function generateStaticParams() {
    return [];
}

export default function DocViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [doc, setDoc] = useState<GeneratedDoc | null>(null);
    const [diff, setDiff] = useState<DiffResult | null>(null);
    const [showDiff, setShowDiff] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const currentDoc = storage.getDocById(id);
        if (currentDoc) {
            setDoc(currentDoc);

            // Find previous doc of same type to compare
            const allDocs = storage.getDocs();
            const previousDoc = allDocs
                .filter(d => d.type === currentDoc.type && d.id !== currentDoc.id && new Date(d.createdAt) < new Date(currentDoc.createdAt))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

            setDiff(computeDiff(previousDoc, currentDoc));
        }
    }, [id]);

    const handleExport = () => {
        setExporting(true);
        // Simulate export delay
        setTimeout(() => {
            setExporting(false);
            alert('Export queued (demo). In a real app, this would download a PDF/Markdown file.');
        }, 1500);
    };

    if (!doc) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-16 h-16 bg-slate-100 rounded-full animate-pulse mb-4"></div>
                <p className="text-slate-500 font-medium">Loading document...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/library"
                        className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
                            <span>{doc.type}</span>
                            <ChevronRight className="w-3 h-3" />
                            <span>{doc.versionTag}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{doc.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowDiff(!showDiff)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${showDiff ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        {showDiff ? 'Hide Changes' : 'View Changes'}
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {exporting ? <Clock className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <Card className="p-0 overflow-visible border-none bg-transparent shadow-none">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-8 md:p-12">
                                <DocRenderer doc={doc} />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    {showDiff && diff && (
                        <Card title="What Changed" subtitle="Since last generation" className="animate-in slide-in-from-right-4 duration-300">
                            <DiffPanel diff={diff} />
                        </Card>
                    )}

                    <Card title="Document Info">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Generated</span>
                                <span className="text-xs font-semibold text-slate-900">{new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Version</span>
                                <span className="text-xs font-semibold text-slate-900">{doc.versionTag}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Status</span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                </span>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Inputs Hash</p>
                                <code className="text-[10px] bg-slate-100 px-2 py-1 rounded block truncate text-slate-600 font-mono">
                                    {doc.inputsHash}
                                </code>
                            </div>
                        </div>
                    </Card>

                    <Card title="Sources Used">
                        <div className="flex flex-wrap gap-2">
                            {doc.selectedSources.map(s => (
                                <span key={s} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase border border-indigo-100">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </Card>

                    <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group">
                        <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold">Share Document</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
