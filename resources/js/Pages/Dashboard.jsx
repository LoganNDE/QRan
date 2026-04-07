import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import QrCard from '@/Components/QrCard';
import ConfirmModal from '@/Components/ConfirmModal';
import { Search, QrCode, Plus, ScanLine, ToggleRight, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function Dashboard({ qrs = [] }) {
    const { flash, qrUsage } = usePage().props;
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null); // qr object | null

    const filtered = qrs.filter(q =>
        q.name.toLowerCase().includes(search.toLowerCase()) ||
        q.destination_url.toLowerCase().includes(search.toLowerCase())
    );

    const totalScans = qrs.reduce((acc, q) => acc + (q.scans_count ?? 0), 0);
    const activeCount = qrs.filter(q => q.is_active).length;

    const limitReached = qrUsage?.reached ?? false;
    const nearLimit = !qrUsage?.is_admin && qrUsage?.limit !== null && qrs.length >= (qrUsage?.limit ?? 0) - 1;
    const limitPct = qrUsage?.limit ? Math.min((qrs.length / qrUsage.limit) * 100, 100) : 0;

    const handleToggle = (qr) => {
        router.patch(route('qr.toggle', qr.id), {}, {
            onSuccess: () => toast.success(qr.is_active ? 'QR desactivado' : 'QR activado'),
            onError: () => toast.error('Error al cambiar estado'),
        });
    };

    const handleDelete = (qr) => setConfirmDelete(qr);

    const confirmDeleteAction = () => {
        router.delete(route('qr.destroy', confirmDelete.id), {
            onSuccess: () => { toast.success('QR eliminado'); setConfirmDelete(null); },
            onError: () => { toast.error('Error al eliminar'); setConfirmDelete(null); },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

            <ConfirmModal
                open={!!confirmDelete}
                title="Eliminar QR"
                message={`¿Seguro que quieres eliminar "${confirmDelete?.name}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                onConfirm={confirmDeleteAction}
                onCancel={() => setConfirmDelete(null)}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Flash error */}
                {flash?.error && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl animate-in fade-in duration-300">
                        <AlertTriangle size={16} className="flex-shrink-0" />
                        {flash.error}
                    </div>
                )}

                {/* Page header */}
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mis QR Codes</h1>
                        {qrUsage?.is_admin && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-black text-white px-2 py-0.5 rounded-full">
                                <ShieldCheck size={11} /> Admin
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">Gestiona y analiza todos tus códigos QR</p>
                </div>

                {/* QR Limit bar */}
                {!qrUsage?.is_admin && qrUsage?.limit !== null && (
                    <div
                        className={`rounded-2xl border p-4 animate-in fade-in slide-in-from-bottom-3 duration-400 ${
                            limitReached ? 'bg-red-50 border-red-200'
                            : nearLimit  ? 'bg-amber-50 border-amber-200'
                            : 'bg-white border-gray-100 shadow-sm'
                        }`}
                        style={{ animationDelay: '40ms', animationFillMode: 'backwards' }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {limitReached || nearLimit
                                    ? <AlertTriangle size={14} className={limitReached ? 'text-red-500' : 'text-amber-500'} />
                                    : <QrCode size={14} className="text-gray-400" />
                                }
                                <span className={`text-sm font-medium ${limitReached ? 'text-red-700' : nearLimit ? 'text-amber-700' : 'text-gray-700'}`}>
                                    {limitReached ? 'Límite alcanzado' : nearLimit ? 'Casi en el límite' : 'Uso de QRs'}
                                </span>
                            </div>
                            <span className={`text-sm font-bold tabular-nums ${limitReached ? 'text-red-700' : nearLimit ? 'text-amber-700' : 'text-gray-900'}`}>
                                {qrs.length} / {qrUsage.limit}
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${limitReached ? 'bg-red-500' : nearLimit ? 'bg-amber-400' : 'bg-black'}`}
                                style={{ width: `${limitPct}%` }}
                            />
                        </div>
                        {limitReached && (
                            <p className="text-xs text-red-600 mt-2">Elimina un QR para poder crear uno nuevo.</p>
                        )}
                    </div>
                )}

                {/* Stats strip */}
                {qrs.length > 0 && (
                    <div
                        className="grid grid-cols-3 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-3 duration-400"
                        style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}
                    >
                        {[
                            { label: 'Total QRs', value: qrs.length, icon: QrCode },
                            { label: 'Activos', value: activeCount, icon: ToggleRight },
                            { label: 'Escaneos totales', value: totalScans, icon: ScanLine },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon size={17} className="text-gray-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg font-bold text-gray-900 leading-none tabular-nums truncate">{value.toLocaleString()}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search */}
                {qrs.length > 0 && (
                    <div
                        className="relative max-w-sm animate-in fade-in duration-400"
                        style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}
                    >
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o URL..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 hover:border-gray-300 transition-all"
                        />
                    </div>
                )}

                {/* Grid / Empty state */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
                            <QrCode size={30} className="text-gray-300" />
                        </div>
                        <p className="text-base font-semibold text-gray-700">
                            {search ? 'Sin resultados' : 'No tienes QR codes aún'}
                        </p>
                        <p className="text-sm text-gray-400 mt-1 mb-6">
                            {search ? 'Prueba con otro término de búsqueda' : 'Crea tu primer QR dinámico en segundos'}
                        </p>
                        {!search && !limitReached && (
                            <Link
                                href={route('qr.create')}
                                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                <Plus size={16} />
                                Crear QR
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((qr, i) => (
                            <div
                                key={qr.id}
                                className="animate-in fade-in slide-in-from-bottom-3 duration-400"
                                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
                            >
                                <QrCard
                                    qr={qr}
                                    onToggle={() => handleToggle(qr)}
                                    onDelete={() => handleDelete(qr)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
