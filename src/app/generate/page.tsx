"use client";

import Wizard from '@/components/Wizard';

export default function GeneratePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Documentation Wizard</h1>
                <p className="text-slate-500 mt-1">Follow the steps to generate high-quality documentation for your project.</p>
            </div>

            <Wizard />
        </div>
    );
}
