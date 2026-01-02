"use client";

import { useState } from 'react';
import {
    Folder,
    File,
    ChevronRight,
    ChevronDown,
    GitCommit,
    GitPullRequest,
    Code2,
    Search,
    Filter
} from 'lucide-react';
import { Card } from '@/components/Cards';
import repoTree from '@/mock-data/repoTree.json';
import commits from '@/mock-data/commits.json';
import prs from '@/mock-data/prs.json';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function TreeNode({ item, depth = 0 }: { item: any, depth?: number }) {
    const [isOpen, setIsOpen] = useState(depth < 1);
    const isDirectory = item.type === 'directory';

    return (
        <div className="select-none">
            <div
                className={cn(
                    "flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-slate-100 text-sm",
                    isDirectory ? "text-slate-700 font-medium" : "text-slate-500"
                )}
                style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
                onClick={() => isDirectory && setIsOpen(!isOpen)}
            >
                {isDirectory ? (
                    <>
                        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                        <Folder className="w-4 h-4 text-indigo-400 fill-indigo-50" />
                    </>
                ) : (
                    <>
                        <div className="w-4" />
                        <File className="w-4 h-4 text-slate-400" />
                    </>
                )}
                <span>{item.name}</span>
            </div>
            {isDirectory && isOpen && item.children && (
                <div>
                    {item.children.map((child: any, i: number) => (
                        <TreeNode key={i} item={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SourcesPage() {
    const [activeTab, setActiveTab] = useState<'code' | 'commits' | 'prs'>('code');

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Repository Sources</h1>
                    <p className="text-slate-500 mt-1">Explore the data being used to generate documentation.</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                            activeTab === 'code' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <Code2 className="w-4 h-4" />
                        Code Tree
                    </button>
                    <button
                        onClick={() => setActiveTab('commits')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                            activeTab === 'commits' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <GitCommit className="w-4 h-4" />
                        Commits
                    </button>
                    <button
                        onClick={() => setActiveTab('prs')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                            activeTab === 'prs' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <GitPullRequest className="w-4 h-4" />
                        Pull Requests
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Source Stats">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Files</span>
                                <span className="text-sm font-bold text-slate-900">142</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Total Commits</span>
                                <span className="text-sm font-bold text-slate-900">842</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Open PRs</span>
                                <span className="text-sm font-bold text-slate-900">12</span>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Languages</p>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>TypeScript</span>
                                            <span>82%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full w-[82%] bg-indigo-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>TSX</span>
                                            <span>15%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full w-[15%] bg-purple-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Other</span>
                                            <span>3%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full w-[3%] bg-slate-400 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Sync Status" className="bg-emerald-50 border-emerald-100">
                        <div className="flex items-center gap-3 text-emerald-700">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold">Connected to GitHub</span>
                        </div>
                        <p className="text-xs text-emerald-600 mt-2">Last synced 12 minutes ago.</p>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card className="min-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {activeTab === 'code' && (
                                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                    <TreeNode item={repoTree} />
                                </div>
                            )}

                            {activeTab === 'commits' && (
                                <div className="space-y-1">
                                    {commits.map((commit) => (
                                        <div key={commit.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group border border-transparent hover:border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                    <GitCommit className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{commit.message}</p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        <span className="font-semibold text-slate-700">{commit.author}</span> • {new Date(commit.timestamp).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {commit.touchedAreas.slice(0, 2).map((area, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                                                        {area}
                                                    </span>
                                                ))}
                                                <code className="text-xs text-indigo-600 font-mono bg-indigo-50 px-2 py-1 rounded">
                                                    {commit.id}
                                                </code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'prs' && (
                                <div className="space-y-1">
                                    {prs.map((pr) => (
                                        <div key={pr.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group border border-transparent hover:border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                                    <GitPullRequest className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{pr.title}</p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        <span className="font-semibold text-slate-700">{pr.author}</span> • {pr.id}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase">
                                                {pr.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
