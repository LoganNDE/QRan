import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { QrCode, LayoutDashboard, User, LogOut, ChevronDown, Plus } from 'lucide-react';

export default function AuthenticatedLayout({ children, header }) {
    const { auth, qrUsage } = usePage().props;
    const user = auth.user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

    const limitReached = qrUsage?.reached ?? false;

    const logout = () => router.post(route('logout'));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 items-center justify-between">
                        {/* Logo */}
                        <Link href={route('dashboard')} className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-black rounded-xl flex items-center justify-center">
                                <QrCode size={15} className="text-white" />
                            </div>
                            <span className="text-sm font-bold tracking-tight hidden sm:block">Qran</span>
                        </Link>

                        {/* Right */}
                        <div className="flex items-center gap-2">
                            {limitReached ? (
                                <div className="relative group">
                                    <button
                                        disabled
                                        className="flex items-center gap-1.5 bg-gray-100 text-gray-400 px-3.5 py-2 rounded-xl text-sm font-medium cursor-not-allowed"
                                    >
                                        <Plus size={15} />
                                        <span className="hidden sm:inline">Nuevo QR</span>
                                    </button>
                                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-gray-900 text-white text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-normal">
                                        Límite de {qrUsage.limit} QRs alcanzado. Elimina uno para continuar.
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={route('qr.create')}
                                    className="flex items-center gap-1.5 bg-black text-white px-3.5 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.97] transition-all duration-150"
                                >
                                    <Plus size={15} />
                                    <span className="hidden sm:inline">Nuevo QR</span>
                                </Link>
                            )}

                            {/* User dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(v => !v)}
                                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold select-none">
                                        {initials}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                                        {user.name}
                                    </span>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                                            <div className="px-3.5 py-2.5 border-b border-gray-100 mb-1">
                                                <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href={route('dashboard')}
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <LayoutDashboard size={14} className="text-gray-400" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                href={route('profile.edit')}
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <User size={14} className="text-gray-400" />
                                                Mi perfil
                                            </Link>
                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                <button
                                                    onClick={logout}
                                                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut size={14} />
                                                    Cerrar sesión
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Optional page sub-header */}
            {header && (
                <div className="bg-white border-b border-gray-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                        {header}
                    </div>
                </div>
            )}

            <main className="flex-1">{children}</main>

            <footer className="border-t border-gray-100 mt-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} Qran — Logan Naranjo Rodríguez</p>
                    <div className="flex gap-4 text-xs text-gray-400">
                        <Link href="/privacy" className="hover:text-black transition-colors">Privacidad</Link>
                        <Link href="/legal" className="hover:text-black transition-colors">Aviso legal</Link>
                        <Link href="/terms" className="hover:text-black transition-colors">Términos</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
