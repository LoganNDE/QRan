import { Link } from '@inertiajs/react';
import { AuroraBackground } from '@/Components/ui/aurora-background';
import { QrCode, ArrowRight, Zap, RefreshCw, BarChart3 } from 'lucide-react';

export default function Welcome() {
    return (
        <AuroraBackground showRadialGradient>
            {/* Navbar */}
            <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-10 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-black rounded-xl flex items-center justify-center">
                        <QrCode size={15} className="text-white" />
                    </div>
                    <span className="text-base font-bold tracking-tight">MQR</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/login" className="text-sm text-gray-600 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-400 hover:text-black bg-white/70 backdrop-blur-sm transition-all duration-200">
                        Entrar
                    </Link>
                    <Link href="/register" className="text-sm bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 active:scale-[0.97] transition-all duration-200">
                        Registrarse
                    </Link>
                </div>
            </nav>

            {/* Hero content */}
            <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-black/5 text-gray-600 px-3 py-1.5 rounded-full mb-5 sm:mb-6 border border-black/10">
                    <Zap size={11} className="text-yellow-500" />
                    QR dinámicos · Sin fecha de caducidad
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
                    Códigos QR que<br />
                    <span className="relative inline-block">
                        evolucionan contigo
                    </span>
                </h1>

                <p className="text-sm sm:text-lg text-gray-500 mb-8 sm:mb-10 max-w-xl leading-relaxed px-2 sm:px-0">
                    Cambia el destino de tus QR en cualquier momento. Analiza cada escaneo. Sin regenerar el código.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Link
                        href="/register"
                        className="flex items-center justify-center gap-2 bg-black text-white px-7 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-medium w-full sm:w-auto
                            hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-md shadow-black/10"
                    >
                        Crear QR gratis
                        <ArrowRight size={17} />
                    </Link>
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 text-gray-500 px-6 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base hover:text-black transition-colors w-full sm:w-auto"
                    >
                        Ya tengo cuenta
                    </Link>
                </div>
            </div>

            {/* Footer inside aurora so no overflow */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-10 flex-wrap px-6">
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} MQR</p>
                <div className="flex gap-4">
                    <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Privacidad</Link>
                    <Link href="/legal" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Aviso legal</Link>
                    <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Términos</Link>
                </div>
            </div>
        </AuroraBackground>
    );
}
