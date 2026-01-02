"use client";

import { useEffect, useState } from 'react';
import { storage, GeneratedDoc } from '@/lib/storage';
import {
    FileText,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Download,
    Trash2,
    Calendar,
    Tag
} from 'lucide-react';
import { Card } from '@/components/Cards';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function LibraryPage() {
    const [docs, setDocs] = useState<GeneratedDoc[]>([]);
    const [filter, setFilter] = useState<'all' | 'architecture' | 'api' | 'onboarding'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        setDocs(storage.getDocs());
    }, []);

    const filteredDocs = docs
        .filter(doc => filter === 'all' || doc.type === filter)
        .filter(doc => doc.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this document?')) {
            storage.deleteDoc(id);
            setDocs(storage.getDocs());
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Documentation Library</h1>
                    <p className="text-slate-500 mt-1">Manage and view all your generated documentation versions.</p>
                </div>
                <Link
                    href="/generate"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/25"
                >
                    New Generation
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    />
                </div>

                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto overflow-x-auto">
                    {['all', 'architecture', 'api', 'onboarding'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t as any)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                                filter === t ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {filteredDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map((doc) => (
                        <Card key={doc.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                    doc.type === 'architecture' ? "bg-blue-50 text-blue-600" :
                                        doc.type === 'api' ? "bg-emerald-50 text-emerald-600" :
                                            "bg-amber-50 text-amber-600"
                                )}>
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{doc.title}</h3>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(doc.createdAt).toLocaleDateString()} at {new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Tag className="w-3.5 h-3.5" />
                                    Version {doc.versionTag}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-2">
                                <Link
                                    href={`/docs/${doc.id}`}
                                    className="flex-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </Link>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No documents found</h3>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto">Try adjusting your filters or generate a new set of documentation.</p>
                    <Link href="/generate" className="mt-8 inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all">
                        Start Generating
                    </Link>
                </div>
            )}
        </div>
    );
}
