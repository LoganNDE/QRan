import { Link } from '@inertiajs/react';
import { QrCode, ScanLine, Trash2, ExternalLink, Calendar, Globe, User, Wifi, FileText } from 'lucide-react';

const TYPE_ICON  = { url: Globe, vcard: User, wifi: Wifi, pdf: FileText };
const TYPE_LABEL = { url: 'URL', vcard: 'vCard', wifi: 'WiFi', pdf: 'PDF' };
const TYPE_COLOR = {
    url:   'text-blue-500 bg-blue-50',
    vcard: 'text-purple-500 bg-purple-50',
    wifi:  'text-green-500 bg-green-50',
    pdf:   'text-orange-500 bg-orange-50',
};

function cardSubtitle(qr) {
    if (qr.qr_type === 'vcard') {
        const name = [qr.meta?.vc_first_name, qr.meta?.vc_last_name].filter(Boolean).join(' ');
        return name || 'vCard';
    }
    if (qr.qr_type === 'wifi') return qr.meta?.wifi_ssid || 'WiFi';
    if (qr.qr_type === 'pdf')  return qr.meta?.pdf_name  || 'Documento PDF';
    return qr.destination_url;
}

export default function QrCard({ qr, onToggle, onDelete }) {
    const lastScan  = qr.last_scan ? new Date(qr.last_scan).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : null;
    const type      = qr.qr_type ?? 'url';
    const TypeIcon  = TYPE_ICON[type]  ?? Globe;
    const typeColor = TYPE_COLOR[type] ?? TYPE_COLOR.url;

    return (
        <div className="group bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:border-gray-200 transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${typeColor}`}>
                        <TypeIcon size={17} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-gray-900 truncate text-sm leading-tight">{qr.name}</h3>
                            <span className="text-[10px] font-medium text-gray-400 flex-shrink-0">{TYPE_LABEL[type]}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{cardSubtitle(qr)}</p>
                    </div>
                </div>

                {/* Toggle */}
                <button
                    onClick={onToggle}
                    title={qr.is_active ? 'Desactivar' : 'Activar'}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${qr.is_active ? 'bg-black' : 'bg-gray-200'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${qr.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
                    <ScanLine size={13} className="text-gray-400" />
                    <span className="font-medium text-gray-700 tabular-nums">{(qr.scans_count ?? 0).toLocaleString()}</span> escaneos
                </div>
                {lastScan && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                        <Calendar size={12} />
                        {lastScan}
                    </div>
                )}
                <span className={`ml-auto flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${qr.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {qr.is_active ? 'Activo' : 'Inactivo'}
                </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1 border-t border-gray-50">
                <Link
                    href={route('qr.show', qr.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-xl transition-colors"
                >
                    <ExternalLink size={13} />
                    Ver detalle
                </Link>
                <button
                    onClick={onDelete}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                    <Trash2 size={13} />
                    Eliminar
                </button>
            </div>
        </div>
    );
}
