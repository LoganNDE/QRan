import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bienvenido de nuevo</h1>
                <p className="text-gray-500 text-sm mt-1">Inicia sesión para gestionar tus QRs</p>
            </div>

            {status && (
                <div className="mb-5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 animate-in fade-in duration-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email */}
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

                {/* Password */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200
                                focus:ring-2 focus:ring-black/10 focus:border-black/30
                                ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">Recordarme</span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-gray-500 hover:text-black transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                </div>

                {/* Submit */}
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
                            Iniciando sesión...
                        </>
                    ) : (
                        <>
                            Iniciar sesión
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                ¿No tienes cuenta?{' '}
                <Link href={route('register')} className="text-black font-medium hover:underline underline-offset-2">
                    Regístrate gratis
                </Link>
            </p>
        </GuestLayout>
    );
}
