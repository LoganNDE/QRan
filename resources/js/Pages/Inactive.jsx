import { Link } from '@inertiajs/react';
import { AuroraBackground } from '@/Components/ui/aurora-background';
import { QrCode, ArrowRight, WifiOff } from 'lucide-react';

export default function Inactive() {
    return (
        <AuroraBackground showRadialGradient>
            <div className="relative z-10 flex flex-col items-center text-center px-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Icon */}
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                    <WifiOff size={28} className="text-gray-400" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                    QR desactivado
                </h1>
                <p className="text-gray-500 text-base max-w-xs leading-relaxed mb-10">
                    El propietario ha desactivado temporalmente este código QR. Por favor, vuelve a intentarlo más tarde.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-md shadow-black/10"
                    >
                        <QrCode size={16} />
                        Crear mi propio QR
                        <ArrowRight size={16} />
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="text-sm text-gray-500 hover:text-black transition-colors px-4 py-3"
                    >
                        Volver atrás
                    </button>
                </div>
            </div>

            {/* Logo bottom */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center">
                        <QrCode size={11} className="text-white" />
                    </div>
                    <span className="text-xs font-medium">Qran</span>
                </Link>
            </div>
        </AuroraBackground>
    );
}
