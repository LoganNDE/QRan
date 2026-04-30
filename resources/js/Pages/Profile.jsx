import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { toast, Toaster } from 'react-hot-toast';
import { User, Mail, AtSign, Lock, Eye, EyeOff, Save, KeyRound, Loader2, Shield, Camera, ImagePlus, X } from 'lucide-react';
import { useRef, useState } from 'react';

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
    const avatarInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile]       = useState(null);

    const profileForm = useForm({
        name:     user.name     ?? '',
        username: user.username ?? '',
        email:    user.email    ?? '',
    });

    const passwordForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    const handleAvatarFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Client-side validation
        const maxMb = 2;
        if (file.size > maxMb * 1024 * 1024) {
            toast.error(`La foto no puede superar ${maxMb} MB.`);
            return;
        }
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowed.includes(file.type)) {
            toast.error('Formato no válido. Usa JPG, PNG, GIF o WEBP.');
            return;
        }

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const clearAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (avatarInputRef.current) avatarInputRef.current.value = '';
    };

    const saveProfile = (e) => {
        e.preventDefault();

        const onError = (errs) => {
            const first = Object.values(errs)[0];
            toast.error(first || 'Error al actualizar el perfil.');
        };

        if (avatarFile) {
            // Send multipart (profile data + avatar in one request)
            const fd = new FormData();
            fd.append('_method', 'PATCH');
            fd.append('name',     profileForm.data.name);
            fd.append('username', profileForm.data.username);
            fd.append('email',    profileForm.data.email);
            fd.append('avatar',   avatarFile);

            router.post(route('profile.update'), fd, {
                forceFormData: true,
                onSuccess: () => {
                    toast.success('Perfil y foto actualizados');
                    clearAvatar();
                },
                onError,
            });
        } else {
            profileForm.patch(route('profile.update'), {
                onSuccess: () => toast.success('Perfil actualizado'),
                onError,
            });
        }
    };

    const savePassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('profile.password'), {
            onSuccess: () => {
                toast.success('Contraseña actualizada');
                passwordForm.reset();
            },
            onError: (errs) => {
                const first = Object.values(errs)[0];
                toast.error(first || 'Error al cambiar la contraseña.');
            },
        });
    };

    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';
    const currentAvatar = avatarPreview || user.avatar_url;

    return (
        <AuthenticatedLayout>
            <Head title="Perfil" />
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

            <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-5">

                {/* Profile info form */}
                <form
                    onSubmit={saveProfile}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5
                        animate-in fade-in slide-in-from-bottom-3 duration-500"
                >
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-900">Información personal</h3>
                    </div>

                    {/* Avatar picker */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow border border-gray-100">
                                {currentAvatar ? (
                                    <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-black text-white flex items-center justify-center text-2xl font-bold select-none">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={clearAvatar}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                                    title="Cancelar"
                                >
                                    <X size={10} />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                <Camera size={15} className="text-gray-400" />
                                {avatarPreview ? 'Cambiar foto seleccionada' : 'Cambiar foto de perfil'}
                            </button>
                            {avatarPreview ? (
                                <p className="text-xs text-amber-600 font-medium">
                                    Nueva foto lista — se guardará al pulsar «Guardar cambios»
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400">JPG, PNG, GIF o WEBP · máx. 2 MB</p>
                            )}
                        </div>

                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleAvatarFile}
                            className="hidden"
                        />
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
                        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-sm font-medium
                            hover:bg-gray-800 active:scale-[0.98] transition-all duration-150
                            disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {profileForm.processing ? (
                            <><Loader2 size={15} className="animate-spin" /> Guardando...</>
                        ) : (
                            <><Save size={15} /> Guardar cambios{avatarPreview ? ' y foto' : ''}</>
                        )}
                    </button>

                    {/* Plan badge */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                        <span className="text-xs text-gray-400">Plan actual</span>
                        <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium capitalize gap-1">
                            <Shield size={11} />
                            {user.plan ?? 'free'}
                        </span>
                    </div>
                </form>

                {/* Password form */}
                <form
                    onSubmit={savePassword}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4
                        animate-in fade-in slide-in-from-bottom-3 duration-500"
                    style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}
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
                        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-sm font-medium
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
