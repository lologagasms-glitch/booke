'use client';

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
    UserIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { authClient } from '@/app/lib/auth-client';
import { User } from 'better-auth/types';

/* -------------------------------------------------- */
/*  UserTable Component                               */
/* -------------------------------------------------- */
export default function UserTable() {
    const queryClient = useQueryClient();

    /* ---- Pagination ---- */
    const [limit, setLimit] = useState<number>(20);
    const [offset, setOffset] = useState<number>(0);

    /* ---- React-Query ---- */
    const { data: usersData, isLoading } = useQuery({
        queryKey: ['users', limit, offset],
        queryFn: async () => {
            const res = await authClient.admin.listUsers({
                query: {
                    limit,
                    offset,
                }
            });
            if (res.error) throw new Error(res.error.message);
            return res.data;
        },
    });

    const users = usersData?.users || [];

    /* ---- Mutations ---- */
    const deleteMutation = useMutation({
        mutationFn: async (userId: string) => {
            const res = await authClient.admin.removeUser({ userId });
            if (res.error) throw new Error(res.error.message);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });

    const setRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role:  "user" | "admin" | ("user" | "admin")[] }) => {
            const res = await authClient.admin.setRole({ userId, role });
            if (res.error) throw new Error(res.error.message);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });

    /* ---- Filters ---- */
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');

    const filtered = useMemo(() => {
        return users.filter((u: any) => {
            const matchSearch =
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase());
            const matchRole = roleFilter ? u.role === roleFilter : true;
            return matchSearch && matchRole;
        });
    }, [users, search, roleFilter]);

    /* ---- UI helpers ---- */
    const roleOptions = ['user', 'admin'];

    /* ---- Edit Modal State ---- */
    const [editingUser, setEditingUser] = useState<any | null>(null);

    if (isLoading)
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                    <p className="text-slate-600 font-medium">Chargement des utilisateurs...</p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* En-tête */}
            <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Utilisateurs</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Barre de filtres */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par nom ou email..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                        />
                    </div>
                    <div className="relative">
                        <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                        >
                            <option value="">Tous les rôles</option>
                            {roleOptions.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-subtle border border-slate-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50/70 text-slate-800 font-semibold border-b border-slate-200/60">
                                <tr>
                                    <th className="px-4 sm:px-6 py-4">Nom</th>
                                    <th className="px-4 sm:px-6 py-4 hidden md:table-cell">Email</th>
                                    <th className="px-4 sm:px-6 py-4">Rôle</th>
                                    <th className="px-4 sm:px-6 py-4 hidden lg:table-cell">Créé le</th>
                                    <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-4 sm:px-6 py-4 font-semibold text-slate-900">
                                            <div className="flex flex-col">
                                                <span className="truncate max-w-[160px] sm:max-w-none">{user.name}</span>
                                                <span className="md:hidden text-xs text-slate-500 truncate max-w-[160px] sm:max-w-none">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 hidden md:table-cell">{user.email}</td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <span className={clsx(
                                                "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                                                user.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                    title="Modifier"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Supprimer l'utilisateur « ${user.name} » ?`)) {
                                                            deleteMutation.mutate(user.id);
                                                        }
                                                    }}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                    title="Supprimer"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {!filtered.length && (
                        <div className="text-center py-12">
                            <p className="text-slate-500 font-medium">Aucun utilisateur trouvé.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-500">
                        Affichage de {filtered.length} utilisateurs
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setOffset((o) => Math.max(o - limit, 0))}
                            disabled={offset === 0}
                            className={clsx(
                                'inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm',
                                offset === 0 && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Précédent
                        </button>
                        <button
                            onClick={() => setOffset((o) => o + limit)}
                            disabled={filtered.length < limit}
                            className={clsx(
                                'inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm',
                                filtered.length < limit && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            Suivant
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={() => {
                        setEditingUser(null);
                        queryClient.invalidateQueries({ queryKey: ['users'] });
                    }}
                />
            )}
        </div>
    );
}

function EditUserModal({ user, onClose, onSave }: { user: any; onClose: () => void; onSave: () => void }) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (role !== user.role) {
                await authClient.admin.setRole({ userId: user.id, role });
            }

            const adminClient = authClient.admin as any;
            if (adminClient.updateUser) {
                await adminClient.updateUser({
                    userId: user.id,
                    data: { name, email }
                });
            }

            onSave();
        } catch (error) {
            console.error("Failed to update user", error);
            alert("Erreur lors de la mise à jour");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-900">Modifier l'utilisateur</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="px-6 py-5 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center gap-2"
                    >
                        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
}
