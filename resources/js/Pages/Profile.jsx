import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { toast, Toaster } from 'react-hot-toast';
import { User, Mail, AtSign, Lock, Eye, EyeOff, Save, KeyRound, Loader2, Shield } from 'lucide-react';
import { useState } from 'react';

function Field({ label, icon: Icon, error, children }) {
    return (
        <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                {Icon && (
                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black pointer-events-none" />
                )}
                {children}
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">{error}</p>
            )}
        </div>
    );
}

function PasswordField({ value, onChange, placeholder, autoComplete, error, icon: Icon }) {
    const [show, setShow] = useState(false);
    return (
        <Field label={null} icon={Icon} error={error}>
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200
                    focus:ring-2 focus:ring-black/10 focus:border-black/30
                    ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
            />
            <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
        </Field>
    );
}

const inputClass = (error) =>
    `w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200
    focus:ring-2 focus:ring-black/10 focus:border-black/30
    ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`;

export default function Profile({ user }) {
    const profileForm = useForm({
        name: user.name ?? '',
        username: user.username ?? '',
        email: user.email ?? '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const saveProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'), {
            onSuccess: () => toast.success('Perfil actualizado'),
            onError: () => toast.error('Error al actualizar'),
        });
    };

    const savePassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('profile.password'), {
            onSuccess: () => {
                toast.success('Contraseña actualizada');
                passwordForm.reset();
            },
            onError: () => toast.error('Error al cambiar contraseña'),
        });
    };

    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

    return (
        <AuthenticatedLayout>
            <Head title="Perfil" />
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

            <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-5">

                {/* Header card — avatar + info */}
                <div
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5
                        animate-in fade-in slide-in-from-bottom-3 duration-500"
                >
                    <div className="relative group">
                        <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-xl font-bold
                            group-hover:scale-105 transition-transform duration-200 cursor-default select-none shadow-md">
                            {initials}
                        </div>
                        <div className="absolute inset-0 rounded-2xl ring-4 ring-black/5 group-hover:ring-black/10 transition-all duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <span className="inline-flex items-center mt-1.5 text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium capitalize gap-1">
                            <Shield size={11} />
                            {user.plan ?? 'free'}
                        </span>
                    </div>
                </div>

                {/* Profile info form */}
                <form
                    onSubmit={saveProfile}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4
                        animate-in fade-in slide-in-from-bottom-3 duration-500"
                    style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <User size={16} className="text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-900">Información personal</h3>
                    </div>

                    <Field label="Nombre completo" icon={User} error={profileForm.errors.name}>
                        <input
                            type="text"
                            value={profileForm.data.name}
                            onChange={e => profileForm.setData('name', e.target.value)}
                            placeholder="Tu nombre"
                            className={inputClass(profileForm.errors.name)}
                        />
                    </Field>

                    <Field label="Nombre de usuario" icon={AtSign} error={profileForm.errors.username}>
                        <input
                            type="text"
                            value={profileForm.data.username}
                            onChange={e => profileForm.setData('username', e.target.value)}
                            placeholder="usuario"
                            className={inputClass(profileForm.errors.username)}
                        />
                    </Field>

                    <Field label="Correo electrónico" icon={Mail} error={profileForm.errors.email}>
                        <input
                            type="email"
                            value={profileForm.data.email}
                            onChange={e => profileForm.setData('email', e.target.value)}
                            placeholder="tu@email.com"
                            className={inputClass(profileForm.errors.email)}
                        />
                    </Field>

                    <button
                        type="submit"
                        disabled={profileForm.processing}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium
                            hover:bg-gray-800 active:scale-[0.98] transition-all duration-150
                            disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {profileForm.processing ? (
                            <><Loader2 size={15} className="animate-spin" /> Guardando...</>
                        ) : (
                            <><Save size={15} /> Guardar cambios</>
                        )}
                    </button>
                </form>

                {/* Password form */}
                <form
                    onSubmit={savePassword}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4
                        animate-in fade-in slide-in-from-bottom-3 duration-500"
                    style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <KeyRound size={16} className="text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-900">Cambiar contraseña</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña actual</label>
                        <PasswordField
                            value={passwordForm.data.current_password}
                            onChange={e => passwordForm.setData('current_password', e.target.value)}
                            placeholder="Tu contraseña actual"
                            autoComplete="current-password"
                            error={passwordForm.errors.current_password}
                            icon={Lock}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
                        <PasswordField
                            value={passwordForm.data.password}
                            onChange={e => passwordForm.setData('password', e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            autoComplete="new-password"
                            error={passwordForm.errors.password}
                            icon={Lock}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar nueva contraseña</label>
                        <PasswordField
                            value={passwordForm.data.password_confirmation}
                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                            placeholder="Repite la nueva contraseña"
                            autoComplete="new-password"
                            error={passwordForm.errors.password_confirmation}
                            icon={Lock}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={passwordForm.processing}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium
                            hover:bg-gray-800 active:scale-[0.98] transition-all duration-150
                            disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {passwordForm.processing ? (
                            <><Loader2 size={15} className="animate-spin" /> Cambiando...</>
                        ) : (
                            <><KeyRound size={15} /> Cambiar contraseña</>
                        )}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
