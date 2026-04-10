import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';
import { useState } from 'react';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const passwordStrength = () => {
        const p = data.password;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    };

    const strength = passwordStrength();
    const strengthLabel = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

    return (
        <GuestLayout>
            <Head title="Restablecer contraseña" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Nueva contraseña</h1>
                <p className="text-gray-500 text-sm mt-1">Elige una contraseña segura para tu cuenta.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Email (readonly, prefilled) */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            autoComplete="username"
                            className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border rounded-xl outline-none transition-all duration-200
                                focus:ring-2 focus:ring-black/10 focus:border-black/30
                                ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Nueva contraseña */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nueva contraseña
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            autoComplete="new-password"
                            autoFocus
                            placeholder="Mínimo 8 caracteres"
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
                    {data.password && (
                        <div className="mt-2 animate-in fade-in duration-200">
                            <div className="flex gap-1 mb-1">
                                {[1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-400">Contraseña {strengthLabel[strength]}</p>
                        </div>
                    )}
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirmar contraseña */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Confirmar contraseña
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black" />
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                            placeholder="Repite la contraseña"
                            className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200
                                focus:ring-2 focus:ring-black/10 focus:border-black/30
                                ${errors.password_confirmation ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        {data.password && data.password_confirmation && data.password === data.password_confirmation && (
                            <Check size={16} className="absolute right-9 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in duration-200" />
                        )}
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {errors.password_confirmation}
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
                            Guardando contraseña...
                        </>
                    ) : (
                        <>
                            Restablecer contraseña
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>
        </GuestLayout>
    );
}
