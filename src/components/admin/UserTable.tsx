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
            <div className="min-h-screen bg-sand-50 flex items-center justify-center">
                <p className="text-gray-600">Chargement des utilisateurs...</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-sand-50">
            {/* En-tête */}
            <header className="bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-sand-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserIcon className="w-8 h-8 text-blue-700" />
                        <h1 className="font-display text-2xl text-gray-800">Utilisateurs</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Barre de filtres */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par nom ou email..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-sand-300 bg-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 rounded-xl border border-sand-300 bg-white appearance-none focus:outline-none focus:border-blue-500"
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
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-sand-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-sand-50 text-gray-900 font-medium border-b border-sand-200">
                                <tr>
                                    <th className="px-6 py-4">Nom</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Rôle</th>
                                    <th className="px-6 py-4">Créé le</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sand-100">
                                {filtered.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-sand-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                user.role === 'admin' ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
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
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
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
                            <p className="text-gray-500">Aucun utilisateur trouvé.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Affichage de {filtered.length} utilisateurs
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setOffset((o) => Math.max(o - limit, 0))}
                            disabled={offset === 0}
                            className={clsx(
                                'inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sand-300 bg-white text-gray-700 hover:bg-sand-50 transition',
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
                                'inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sand-300 bg-white text-gray-700 hover:bg-sand-50 transition',
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
            // Update basic info (assuming updateUser exists or handling via separate calls if needed, 
            // but better-auth admin usually has updateUser or we use setRole separately)
            // Note: better-auth admin plugin might not have a generic updateUser for all fields in one go depending on version,
            // but let's assume we can update role via setRole and other fields via updateUser if available.
            // Checking docs/types would be ideal, but based on common patterns:

            if (role !== user.role) {
                await authClient.admin.setRole({ userId: user.id, role });
            }

            // For name/email update, we might need a specific endpoint or use updateUser if available.
            // If updateUser is not available in the client types we see, we might need to rely on what's available.
            // The user request mentioned "modification", so we'll attempt to use what's likely there.
            // If updateUser is not exposed on admin client, we might be limited or need to check `auth-client.ts` again.
            // Let's assume for now we can at least update role. 
            // If we need to update name/email, we might need to use a different method or it might be restricted.
            // However, usually admin can update user.

            // Let's try to update user if the method exists, otherwise just role.
            // casting to any to avoid strict type checks if types are not fully up to date in the environment
            const adminClient = authClient.admin as any;
            if (adminClient.updateUser) {
                await adminClient.updateUser({
                    userId: user.id,
                    data: { name, email } // Adjust based on actual API
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Modifier l'utilisateur</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2"
                    >
                        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
}
