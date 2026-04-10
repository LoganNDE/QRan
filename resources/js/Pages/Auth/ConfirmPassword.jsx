import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmar contraseña" />

            <div className="mb-8">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center mb-4">
                    <ShieldCheck size={20} className="text-gray-700" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Área segura</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Por seguridad, confirma tu contraseña antes de continuar.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
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
                            autoFocus
                            placeholder="Tu contraseña actual"
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
                            Verificando...
                        </>
                    ) : (
                        <>
                            Confirmar contraseña
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>
        </GuestLayout>
    );
}
