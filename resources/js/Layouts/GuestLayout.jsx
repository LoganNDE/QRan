import { Link } from '@inertiajs/react';
import { QrCode } from 'lucide-react';

// Fixed decorative QR-like pattern
const DOTS = [
    1,0,1,1,0,0,1,0,
    0,1,1,0,1,1,0,1,
    1,0,0,1,0,1,1,0,
    1,1,0,0,1,0,0,1,
    0,0,1,1,0,1,1,0,
    1,0,1,0,1,0,0,1,
    0,1,0,1,1,1,0,1,
    1,1,0,0,0,1,1,0,
];

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-[100dvh] flex">
            {/* Left — branding panel */}
            <div className="hidden lg:flex lg:w-[46%] bg-black flex-col justify-between p-12 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.04] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.04] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <Link href="/" className="flex items-center gap-2.5 text-white z-10">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <QrCode size={18} className="text-black" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Qran</span>
                </Link>

                <div className="z-10">
                    <h2 className="text-[2.4rem] font-bold text-white leading-[1.15] mb-4">
                        QRs dinámicos<br />que nunca caducan.
                    </h2>
                    <p className="text-gray-400 text-base leading-relaxed max-w-xs">
                        Cambia el destino de tu QR en cualquier momento, sin regenerarlo ni reimprimirlo.
                    </p>

                    {/* Decorative dot grid */}
                    <div className="mt-10 inline-grid grid-cols-8 gap-1.5 opacity-[0.15]">
                        {DOTS.map((on, i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-sm transition-opacity ${on ? 'bg-white' : 'bg-transparent'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="z-10 space-y-1">
                    <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Qran — Logan Naranjo Rodríguez</p>
                    <div className="flex gap-3">
                        <Link href="/privacy" className="text-gray-600 text-xs hover:text-gray-300 transition-colors">Privacidad</Link>
                        <Link href="/legal" className="text-gray-600 text-xs hover:text-gray-300 transition-colors">Aviso legal</Link>
                        <Link href="/terms" className="text-gray-600 text-xs hover:text-gray-300 transition-colors">Términos</Link>
                    </div>
                </div>
            </div>

            {/* Right — form panel */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 sm:p-10">
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Mobile logo */}
                    <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
                        <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                            <QrCode size={15} className="text-white" />
                        </div>
                        <span className="text-base font-bold">Qran</span>
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
}
