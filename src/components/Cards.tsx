import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    footer?: ReactNode;
}

export function Card({ children, className, title, subtitle, icon, footer }: CardProps) {
    return (
        <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col", className)}>
            {(title || icon) && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        {title && <h3 className="font-semibold text-slate-900">{title}</h3>}
                        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                    {icon && <div className="text-slate-400">{icon}</div>}
                </div>
            )}
            <div className="p-6 flex-1">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                    {footer}
                </div>
            )}
        </div>
    );
}

export function StatCard({ title, value, change, icon, trend }: {
    title: string,
    value: string | number,
    change?: string,
    icon: ReactNode,
    trend?: 'up' | 'down' | 'neutral'
}) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-2">{value}</h4>
                    {change && (
                        <p className={cn(
                            "text-xs mt-2 font-medium",
                            trend === 'up' ? "text-emerald-600" : trend === 'down' ? "text-rose-600" : "text-slate-500"
                        )}>
                            {change} <span className="text-slate-400 font-normal">vs last month</span>
                        </p>
                    )}
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                    {icon}
                </div>
            </div>
        </Card>
    );
}
