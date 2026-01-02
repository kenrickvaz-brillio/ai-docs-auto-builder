"use client";

import { useState } from 'react';
import {
    Settings,
    Moon,
    Sun,
    Monitor,
    Database,
    Shield,
    Bell,
    Trash2,
    RefreshCw
} from 'lucide-react';
import { Card } from '@/components/Cards';
import { storage } from '@/lib/storage';

export default function SettingsPage() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

    const clearLibrary = () => {
        if (confirm('Are you sure you want to clear all generated documents? This cannot be undone.')) {
            localStorage.removeItem('ai_docs_auto_builder_docs');
            window.location.reload();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your preferences and demo configuration.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card title="Appearance" subtitle="Customize how the application looks">
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { id: 'light', label: 'Light', icon: Sun },
                            { id: 'dark', label: 'Dark', icon: Moon },
                            { id: 'system', label: 'System', icon: Monitor },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id as any)}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === t.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                                    }`}
                            >
                                <t.icon className="w-6 h-6" />
                                <span className="text-sm font-bold">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card title="Demo Configuration" subtitle="Tweak the simulation behavior">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-slate-900">Deterministic Mode</p>
                                <p className="text-xs text-slate-500">Ensure same inputs always produce same outputs</p>
                            </div>
                            <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-slate-900">Simulate Network Latency</p>
                                <p className="text-xs text-slate-500">Add artificial delays to generation steps</p>
                            </div>
                            <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Danger Zone" className="border-rose-100">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-slate-900">Clear Document Library</p>
                                <p className="text-xs text-slate-500">Permanently delete all generated documentation</p>
                            </div>
                            <button
                                onClick={clearLibrary}
                                className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-slate-900">Reset Demo Data</p>
                                <p className="text-xs text-slate-500">Restore mock data to its original state</p>
                            </div>
                            <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
