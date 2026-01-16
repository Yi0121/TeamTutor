'use client';

import { useState } from 'react';
import { ChevronDown, User, Shield, GraduationCap, School, Settings } from 'lucide-react';
import { useAuth, type UserRole, ROLE_DISPLAY_NAMES } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
    super_admin: <Shield className="w-4 h-4" />,
    school_admin: <School className="w-4 h-4" />,
    teacher: <GraduationCap className="w-4 h-4" />,
    student: <User className="w-4 h-4" />,
};

const ROLE_COLORS: Record<UserRole, string> = {
    super_admin: 'bg-red-100 text-red-700 border-red-200',
    school_admin: 'bg-purple-100 text-purple-700 border-purple-200',
    teacher: 'bg-blue-100 text-blue-700 border-blue-200',
    student: 'bg-green-100 text-green-700 border-green-200',
};

export function RoleSwitcher() {
    const { user, switchRole } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const roles: UserRole[] = ['super_admin', 'school_admin', 'teacher', 'student'];

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={`gap-2 ${ROLE_COLORS[user.role]}`}
            >
                {ROLE_ICONS[user.role]}
                <span>{ROLE_DISPLAY_NAMES[user.role]}</span>
                <ChevronDown className="w-3 h-3" />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                        <div className="px-3 py-2 border-b border-slate-100">
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Settings className="w-3 h-3" />
                                開發模式 - 切換角色
                            </p>
                        </div>
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => {
                                    switchRole(role);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 ${role === user.role ? 'bg-slate-100 font-medium' : ''
                                    }`}
                            >
                                {ROLE_ICONS[role]}
                                <span>{ROLE_DISPLAY_NAMES[role]}</span>
                                {role === user.role && (
                                    <span className="ml-auto text-xs text-slate-400">目前</span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
