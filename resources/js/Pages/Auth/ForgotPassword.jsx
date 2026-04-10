import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar contraseña" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">¿Olvidaste tu contraseña?</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Introduce tu email y te enviaremos un enlace para restablecerla.
                </p>
            </div>

            {status && (
                <div className="mb-5 flex items-start gap-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 animate-in fade-in duration-300">
                    <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-green-200 flex items-center justify-center">
                        <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                            <path d="M2 6l3 3 5-5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black" />
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            autoComplete="email"
                            autoFocus
                            placeholder="tu@email.com"
                            className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200
                                focus:ring-2 focus:ring-black/10 focus:border-black/30
                                ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {errors.email}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 px-4 rounded-xl text-sm font-medium
                        hover:bg-gray-800 active:scale-[0.98] transition-all duration-150
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 mt-2"
                >
                    {processing ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Enviando enlace...
                        </>
                    ) : (
                        <>
                            Enviar enlace de recuperación
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-1 text-black font-medium hover:underline underline-offset-2"
                >
                    <ArrowLeft size={14} />
                    Volver al inicio de sesión
                </Link>
            </p>
        </GuestLayout>
    );
}
