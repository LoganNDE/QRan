import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { toast, Toaster } from 'react-hot-toast';
import { Settings, UserX, UserCheck, ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminSettings({ registrations_enabled }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing } = useForm({
        registrations_enabled: registrations_enabled,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const save = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            onSuccess: () => toast.success('Configuración guardada'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Administración" />
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
                    <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShieldAlert size={17} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Administración</h1>
                        <p className="text-sm text-gray-500">Configuración del sistema</p>
                    </div>
                </div>

                <form onSubmit={save} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '60ms', animationFillMode: 'backwards' }}>
                    {/* Registrations toggle */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex items-start gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${data.registrations_enabled ? 'bg-green-50' : 'bg-red-50'}`}>
                                    {data.registrations_enabled
                                        ? <UserCheck size={17} className="text-green-600" />
                                        : <UserX size={17} className="text-red-600" />
                                    }
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Registro de nuevos usuarios</p>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                        {data.registrations_enabled
                                            ? 'Los nuevos usuarios pueden crear una cuenta libremente.'
                                            : 'Los registros están desactivados. Los visitantes verán un aviso y podrán solicitar acceso por email.'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Toggle switch */}
                            <button
                                type="button"
                                onClick={() => setData('registrations_enabled', !data.registrations_enabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                                    data.registrations_enabled ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                        data.registrations_enabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        {!data.registrations_enabled && (
                            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 animate-in fade-in slide-in-from-top-2 duration-200">
                                Los usuarios que intenten registrarse verán un aviso indicando que contacten con <strong>contact@logannr.me</strong> para solicitar acceso.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                            <Settings size={15} />
                            {processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
