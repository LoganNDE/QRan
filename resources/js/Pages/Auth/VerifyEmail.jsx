import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowRight, Loader2, LogOut } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar email" />

            <div className="mb-8">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center mb-4">
                    <Mail size={20} className="text-gray-700" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verifica tu email</h1>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    Hemos enviado un enlace de verificación a tu correo. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-5 flex items-start gap-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 animate-in fade-in duration-300">
                    <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-green-200 flex items-center justify-center">
                        <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                            <path d="M2 6l3 3 5-5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    Hemos enviado un nuevo enlace de verificación a tu correo.
                </div>
            )}

            <form onSubmit={submit}>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 px-4 rounded-xl text-sm font-medium
                        hover:bg-gray-800 active:scale-[0.98] transition-all duration-150
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    {processing ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            Reenviar email de verificación
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="inline-flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors"
                >
                    <LogOut size={14} />
                    Cerrar sesión
                </Link>
            </p>
        </GuestLayout>
    );
}
