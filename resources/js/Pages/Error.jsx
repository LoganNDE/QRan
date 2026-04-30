import { Link } from '@inertiajs/react';
import { QrCode, ArrowLeft, RotateCcw } from 'lucide-react';

const ERRORS = {
    403: {
        label: 'Acceso denegado',
        desc: 'No tienes los permisos necesarios para ver esta página.',
        hint: 'Si crees que es un error, contacta con el administrador.',
    },
    404: {
        label: 'Página no encontrada',
        desc: 'La página que buscas no existe o ha sido movida.',
        hint: 'Comprueba la URL o vuelve al inicio.',
    },
    419: {
        label: 'Sesión expirada',
        desc: 'Tu sesión ha caducado por inactividad.',
        hint: 'Recarga la página para continuar.',
        reload: true,
    },
    429: {
        label: 'Demasiadas solicitudes',
        desc: 'Has enviado demasiadas peticiones en poco tiempo.',
        hint: 'Espera unos segundos e inténtalo de nuevo.',
    },
    500: {
        label: 'Error del servidor',
        desc: 'Algo ha fallado en nuestro lado. Ya estamos en ello.',
        hint: 'Inténtalo de nuevo en unos minutos.',
    },
    503: {
        label: 'En mantenimiento',
        desc: 'El servicio está temporalmente fuera de línea.',
        hint: 'Volvemos enseguida. Gracias por tu paciencia.',
    },
};

export default function Error({ status = 404 }) {
    const err = ERRORS[status] ?? {
        label: 'Error inesperado',
        desc: 'Ha ocurrido algo que no esperábamos.',
        hint: 'Por favor, inténtalo de nuevo.',
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 flex flex-col overflow-hidden relative">

            {/* Dot grid */}
            <div
                className="pointer-events-none fixed inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Soft glow */}
            <div
                className="pointer-events-none fixed inset-0 flex items-center justify-center"
            >
                <div
                    className="w-[700px] h-[700px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)' }}
                />
            </div>

            {/* Nav */}
            <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <QrCode size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-gray-900">MQR</span>
                </Link>
            </nav>

            {/* Main */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">

                {/* Ghost number */}
                <div
                    className="absolute select-none pointer-events-none font-black leading-none text-gray-900"
                    style={{
                        fontSize: 'clamp(160px, 32vw, 360px)',
                        opacity: 0.04,
                        letterSpacing: '-0.05em',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {status}
                </div>

                {/* Status pill */}
                <div
                    className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm"
                    style={{ animation: 'fadeUp 0.5s ease both' }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Error {status}</span>
                </div>

                {/* Title */}
                <h1
                    className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4 leading-tight"
                    style={{ animation: 'fadeUp 0.5s 0.08s ease both' }}
                >
                    {err.label}
                </h1>

                {/* Desc */}
                <p
                    className="text-base text-gray-600 max-w-sm leading-relaxed mb-2"
                    style={{ animation: 'fadeUp 0.5s 0.15s ease both' }}
                >
                    {err.desc}
                </p>
                <p
                    className="text-sm text-gray-400 max-w-xs mb-10"
                    style={{ animation: 'fadeUp 0.5s 0.2s ease both' }}
                >
                    {err.hint}
                </p>

                {/* Actions */}
                <div
                    className="flex flex-col sm:flex-row gap-3"
                    style={{ animation: 'fadeUp 0.5s 0.27s ease both' }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-[0.97] transition-all duration-150 shadow-sm"
                    >
                        <ArrowLeft size={15} />
                        Volver al inicio
                    </Link>

                    {err.reload && (
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97] transition-all duration-150 shadow-sm"
                        >
                            <RotateCcw size={14} />
                            Recargar
                        </button>
                    )}
                </div>
            </main>

            {/* Glass footer */}
            <footer
                className="relative z-10 px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2"
                style={{
                    animation: 'fadeUp 0.5s 0.35s ease both',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    background: 'rgba(255,255,255,0.6)',
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                }}
            >
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} MQR — Logan Naranjo Rodríguez</p>
                <div className="flex gap-5 text-xs text-gray-400">
                    <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacidad</Link>
                    <Link href="/legal"   className="hover:text-gray-900 transition-colors">Aviso legal</Link>
                    <Link href="/terms"   className="hover:text-gray-900 transition-colors">Términos</Link>
                </div>
            </footer>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
