"use client";

import { useSearchParams } from 'next/navigation';
import DocViewerClient from '@/components/DocViewerClient';
import { Suspense } from 'react';

function DocViewerContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    if (!id) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <p className="text-slate-500 font-medium">No document ID provided.</p>
            </div>
        );
    }

    return <DocViewerClient id={id} />;
}

export default function DocPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DocViewerContent />
        </Suspense>
    );
}
