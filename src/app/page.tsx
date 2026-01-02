"use client";

import {
  FileText,
  GitCommit,
  Code2,
  Activity,
  ArrowUpRight,
  Clock,
  Plus,
  Wand2
} from 'lucide-react';
import { StatCard, Card } from '@/components/Cards';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [recentDocs, setRecentDocs] = useState<any[]>([]);

  useEffect(() => {
    const docs = storage.getDocs();
    setRecentDocs(docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Project Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with Hotel Audits Mobile.</p>
        </div>
        <Link
          href="/generate"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/25"
        >
          <Wand2 className="w-4 h-4" />
          Generate Docs
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value={recentDocs.length}
          change="+2"
          trend="up"
          icon={<FileText className="w-6 h-6" />}
        />
        <StatCard
          title="Recent Commits"
          value="15"
          change="+5"
          trend="up"
          icon={<GitCommit className="w-6 h-6" />}
        />
        <StatCard
          title="API Endpoints"
          value="6"
          change="0"
          trend="neutral"
          icon={<Code2 className="w-6 h-6" />}
        />
        <StatCard
          title="Doc Health"
          value="75%"
          change="+12%"
          trend="up"
          icon={<Activity className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Recent Documentation"
            subtitle="Latest generated versions"
            icon={<Link href="/library" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></Link>}
          >
            {recentDocs.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentDocs.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/docs?id=${doc.id}`}
                    className="flex items-center justify-between py-4 hover:bg-slate-50 -mx-6 px-6 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{doc.title}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase text-[10px] font-bold">{doc.type}</span>
                          • {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">{doc.versionTag}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Deterministic Hash: {doc.inputsHash}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No documents generated yet.</p>
                <Link href="/generate" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">Start your first generation</Link>
              </div>
            )}
          </Card>

          <Card title="Repository Activity" subtitle="Recent commits and PRs">
            <div className="space-y-6">
              {[
                { type: 'commit', user: 'Sarah Chen', action: 'merged', target: 'offline-sync-engine', time: '2 hours ago' },
                { type: 'pr', user: 'Mike Ross', action: 'opened', target: 'feat/ocr-optimization', time: '5 hours ago' },
                { type: 'commit', user: 'Alex Rivera', action: 'pushed', target: 'auth-biometrics', time: '1 day ago' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                    {i !== 2 && <div className="absolute top-8 left-4 w-px h-6 bg-slate-100"></div>}
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">{item.user}</span> {item.action} <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{item.target}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none">
            <h3 className="text-lg font-bold">Documentation Health</h3>
            <p className="text-indigo-100 text-sm mt-2 opacity-90">Your documentation is currently at 75% coverage. Add API docs to reach 90%.</p>
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>Architecture</span>
                  <span>100%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>API Reference</span>
                  <span>45%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-[45%] bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>Onboarding</span>
                  <span>80%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 bg-white text-indigo-600 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
              Improve Health
            </button>
          </Card>

          <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors gap-2 group">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600">New Source</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors gap-2 group">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Run Audit</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
