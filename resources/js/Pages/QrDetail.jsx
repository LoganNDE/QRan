import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { toast, Toaster } from 'react-hot-toast';
import ColorPicker from '@/Components/ColorPicker';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
    ArrowLeft, Copy, Download, ScanLine, Link2, Hash,
    Pencil, X, Save, Loader2, ToggleLeft, ToggleRight, Palette,
    Globe, User, Wifi, ImagePlus, Trash2, CalendarDays, TrendingUp, Clock, Monitor, MapPin,
    FileText, ExternalLink
} from 'lucide-react';

const COLORS = ['#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'];
const PREVIEW_SIZE = 220;

const TYPE_META = {
    url:   { icon: Globe,     label: 'URL',   color: 'text-blue-600 bg-blue-50 border-blue-100' },
    vcard: { icon: User,      label: 'vCard', color: 'text-purple-600 bg-purple-50 border-purple-100' },
    wifi:  { icon: Wifi,      label: 'WiFi',  color: 'text-green-600 bg-green-50 border-green-100' },
    pdf:   { icon: FileText,  label: 'PDF',   color: 'text-orange-600 bg-orange-50 border-orange-100' },
};

const DEVICE_LABELS  = { mobile: 'Móvil', desktop: 'Escritorio', tablet: 'Tablet' };
const translate = (val) => val === 'Unknown' || !val ? 'Desconocido' : val;
const deviceLabel = (d) => DEVICE_LABELS[d] ?? translate(d);

function buildWifi(d) {
    const esc = s => String(s || '').replace(/([\\;,":])/, '\\$1');
    return `WIFI:T:${d.wifi_security || 'WPA'};S:${esc(d.wifi_ssid)};P:${esc(d.wifi_password)};H:${d.wifi_hidden ? 'true' : 'false'};;`;
}

function validateByType(data, type) {
    const errs = {};
    if (!data.name.trim()) errs.name = 'El nombre es obligatorio.';
    else if (data.name.trim().length > 100) errs.name = 'Máximo 100 caracteres.';

    if (type === 'url') {
        if (!data.destination_url.trim()) {
            errs.destination_url = 'La URL es obligatoria.';
        } else {
            try { new URL(data.destination_url); }
            catch { errs.destination_url = 'Introduce una URL válida (ej: https://ejemplo.com).'; }
        }
    } else if (type === 'vcard') {
        if (!data.vc_first_name.trim()) errs.vc_first_name = 'El nombre es obligatorio.';
    } else if (type === 'wifi') {
        if (!data.wifi_ssid.trim()) errs.wifi_ssid = 'El nombre de la red es obligatorio.';
    }
    return errs;
}

function formatDate(dt) {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function QrDetail({ qr, stats }) {
    const qrRef      = useRef(null);
    const qrInstance = useRef(null);
    const [editing, setEditing]           = useState(false);
    const [clientErrors, setClientErrors] = useState({});
    const [touched, setTouched]           = useState({});

    // PDF state
    const [pdfFile, setPdfFile]           = useState(null);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const pdfInputRef = useRef(null);

    // Logo state
    const [logoFile, setLogoFile]       = useState(null);
    const [logoSize, setLogoSize]       = useState(qr.logo_size || 30);
    const [logoPreview, setLogoPreview] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const logoInputRef = useRef(null);

    const { data, setData, put, processing, errors } = useForm({
        name:             qr.name,
        destination_url:  qr.destination_url,
        vc_first_name: qr.meta?.vc_first_name ?? '',
        vc_last_name:  qr.meta?.vc_last_name  ?? '',
        vc_phone:      qr.meta?.vc_phone      ?? '',
        vc_email:      qr.meta?.vc_email      ?? '',
        vc_company:    qr.meta?.vc_company    ?? '',
        vc_website:    qr.meta?.vc_website    ?? '',
        vc_address:    qr.meta?.vc_address    ?? '',
        wifi_ssid:     qr.meta?.wifi_ssid     ?? '',
        wifi_password: qr.meta?.wifi_password ?? '',
        wifi_security: qr.meta?.wifi_security ?? 'WPA',
        wifi_hidden:   qr.meta?.wifi_hidden   ?? false,
        fg_color:         qr.fg_color,
        bg_color:         qr.bg_color,
        dot_style:        qr.dot_style,
        corner_style:     qr.corner_style,
        qr_size:          qr.qr_size,
        error_correction: qr.error_correction,
    });

    const redirectUrl = `${window.location.origin}/r/${qr.slug}`;

    const qrPreviewData = useMemo(() => {
        if (qr.qr_type === 'wifi') return buildWifi(data);
        return redirectUrl;
    }, [qr.qr_type, redirectUrl, data.wifi_ssid, data.wifi_password, data.wifi_security, data.wifi_hidden]);

    useEffect(() => {
        try {
            const opts = {
                width: qr.qr_size, height: qr.qr_size,
                data: qrPreviewData,
                dotsOptions:          { color: qr.fg_color,    type: qr.dot_style },
                cornersSquareOptions: { type: qr.corner_style },
                backgroundOptions:    { color: qr.bg_color },
            };
            if (qr.logo_url) {
                opts.image = qr.logo_url;
                opts.imageOptions = { crossOrigin: 'anonymous', margin: 4, imageSize: (qr.logo_size || 30) / 100 };
            }
            qrInstance.current = new QRCodeStyling(opts);
            if (qrRef.current) {
                qrRef.current.innerHTML = '';
                qrInstance.current.append(qrRef.current);
            }
        } catch (err) {
            console.error('[QrDetail] Error al inicializar QR:', err);
        }
    }, []);

    useEffect(() => {
        qrInstance.current?.update({
            data:                 qrPreviewData,
            dotsOptions:          { color: data.fg_color,    type: data.dot_style },
            cornersSquareOptions: { type: data.corner_style },
            backgroundOptions:    { color: data.bg_color },
            width:  data.qr_size,
            height: data.qr_size,
        });
    }, [qrPreviewData, data.fg_color, data.bg_color, data.dot_style, data.corner_style, data.qr_size]);

    // Re-apply logo when qr.logo_url changes (after upload/remove Inertia refreshes props)
    useEffect(() => {
        if (!qrInstance.current) return;
        if (qr.logo_url) {
            qrInstance.current.update({
                image: qr.logo_url,
                imageOptions: { crossOrigin: 'anonymous', margin: 4, imageSize: (qr.logo_size || 30) / 100 },
            });
        } else {
            qrInstance.current.update({ image: '' });
        }
    }, [qr.logo_url, qr.logo_size]);

    useEffect(() => {
        if (Object.keys(touched).length > 0) {
            const errs = validateByType(data, qr.qr_type);
            const visible = {};
            Object.keys(touched).forEach(k => { if (errs[k]) visible[k] = errs[k]; });
            setClientErrors(visible);
        }
    }, [data]);

    const touch = (field) => setTouched(t => ({ ...t, [field]: true }));
    const allErrors = { ...errors, ...clientErrors };
    const scale = data.qr_size <= PREVIEW_SIZE ? 1 : PREVIEW_SIZE / data.qr_size;

    const inputClass = (field) =>
        `w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200
        focus:ring-2 focus:ring-black/10 focus:border-black/30 hover:border-gray-300
        ${allErrors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`;

    const save = (e) => {
        e.preventDefault();
        const errs = validateByType(data, qr.qr_type);
        if (Object.keys(errs).length > 0) {
            setClientErrors(errs);
            const t = {};
            Object.keys(errs).forEach(k => t[k] = true);
            setTouched(t);
            toast.error('Corrige los errores antes de guardar.');
            return;
        }
        put(route('qr.update', qr.id), {
            onSuccess: () => { toast.success('QR actualizado'); setEditing(false); setClientErrors({}); setTouched({}); },
            onError:   () => toast.error('Error al actualizar'),
        });
    };

    const copy     = () => navigator.clipboard.writeText(redirectUrl).then(() => toast.success('URL copiada'));
    const download = (ext) => qrInstance.current?.download({ name: qr.name, extension: ext });
    const toggle   = () => {
        router.patch(route('qr.toggle', qr.id), {}, {
            onSuccess: () => toast.success(qr.is_active ? 'QR desactivado' : 'QR activado'),
        });
    };

    // PDF handlers
    const uploadPdf = (e) => {
        e.preventDefault();
        if (!pdfFile) return;
        const fd = new FormData();
        fd.append('pdf_file', pdfFile);
        setUploadingPdf(true);
        router.post(route('qr.pdf', qr.id), fd, {
            onSuccess: () => { toast.success('PDF actualizado'); setPdfFile(null); setUploadingPdf(false); },
            onError: () => { toast.error('Error al subir el PDF'); setUploadingPdf(false); },
        });
    };

    // Logo handlers
    const handleLogoFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const logoChanged = logoFile !== null || logoSize !== (qr.logo_size || 30);

    const uploadLogo = (e) => {
        e.preventDefault();
        if (!logoChanged) return;
        const fd = new FormData();
        if (logoFile) fd.append('logo', logoFile);
        fd.append('logo_size', logoSize);
        setUploadingLogo(true);
        router.post(route('qr.logo', qr.id), fd, {
            onSuccess: () => {
                toast.success('Logo actualizado');
                setLogoFile(null);
                setLogoPreview(null);
                setUploadingLogo(false);
            },
            onError: () => { toast.error('Error al subir el logo'); setUploadingLogo(false); },
        });
    };

    const removeLogo = () => {
        router.delete(route('qr.logo.remove', qr.id), {
            onSuccess: () => { toast.success('Logo eliminado'); setLogoFile(null); setLogoPreview(null); },
            onError:   () => toast.error('Error al eliminar el logo'),
        });
    };

    const typeInfo = TYPE_META[qr.qr_type] ?? TYPE_META.url;
    const TypeIcon = typeInfo.icon;

    const contentSummary = () => {
        if (qr.qr_type === 'vcard') {
            const name = [qr.meta?.vc_first_name, qr.meta?.vc_last_name].filter(Boolean).join(' ');
            return name || '—';
        }
        if (qr.qr_type === 'wifi') return qr.meta?.wifi_ssid || '—';
        if (qr.qr_type === 'pdf')  return qr.meta?.pdf_name || '—';
        return qr.destination_url;
    };

    const currentLogo = logoPreview || qr.logo_url || null;

    return (
        <AuthenticatedLayout>
            <Head title={qr.name} />
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Page header */}
                <div className="flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3 duration-400">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors flex-shrink-0"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Volver</span>
                        </Link>
                        <span className="text-gray-200">/</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg border ${typeInfo.color}`}>
                            <TypeIcon size={11} />
                            {typeInfo.label}
                        </span>
                        <h1 className="text-lg font-bold text-gray-900 truncate">{qr.name}</h1>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={toggle}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                                qr.is_active
                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {qr.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            {qr.is_active ? 'Activo' : 'Inactivo'}
                        </button>
                        <button
                            onClick={() => setEditing(v => !v)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                                editing
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                            {editing ? <><X size={15} /> Cancelar</> : <><Pencil size={14} /> Editar</>}
                        </button>
                    </div>
                </div>

                {/* Top row: QR + Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* QR preview card */}
                    <div
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4
                            animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{ animationDelay: '60ms', animationFillMode: 'backwards' }}
                    >
                        <div
                            className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center"
                            style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
                        >
                            <div
                                ref={qrRef}
                                style={{
                                    position: 'absolute',
                                    top: '50%', left: '50%',
                                    transform: `translate(-50%, -50%) scale(${scale})`,
                                    transformOrigin: 'center center',
                                }}
                            />
                        </div>

                        {qr.qr_type !== 'wifi' && (
                            <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex items-center justify-between gap-2 overflow-hidden">
                                <span className="text-xs text-gray-500 truncate font-mono min-w-0">{redirectUrl}</span>
                                <button onClick={copy} className="text-gray-400 hover:text-black transition-colors flex-shrink-0">
                                    <Copy size={14} />
                                </button>
                            </div>
                        )}

                        <div className="flex gap-2 w-full">
                            {qr.qr_type !== 'wifi' && (
                                <button onClick={copy} className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2 rounded-xl text-xs hover:bg-gray-50 hover:border-gray-300 transition-all">
                                    <Copy size={13} /> Copiar
                                </button>
                            )}
                            <button onClick={() => download('png')} className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2 rounded-xl text-xs hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <Download size={13} /> PNG
                            </button>
                            <button onClick={() => download('svg')} className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2 rounded-xl text-xs hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <Download size={13} /> SVG
                            </button>
                        </div>
                    </div>

                    {/* Info cards */}
                    <div
                        className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 content-start
                            animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}
                    >
                        {/* Total scans */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <ScanLine size={13} /> Total escaneos
                            </div>
                            <p className="text-3xl font-bold text-gray-900 tabular-nums">{(qr.scans_count ?? 0).toLocaleString()}</p>
                        </div>

                        {/* Today */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <CalendarDays size={13} /> Hoy
                            </div>
                            <p className="text-3xl font-bold text-gray-900 tabular-nums">{(stats.today ?? 0).toLocaleString()}</p>
                        </div>

                        {/* This week */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <TrendingUp size={13} /> Esta semana
                            </div>
                            <p className="text-3xl font-bold text-gray-900 tabular-nums">{(stats.week ?? 0).toLocaleString()}</p>
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:col-span-2 flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <TypeIcon size={13} />
                                {qr.qr_type === 'url'   && 'URL destino'}
                                {qr.qr_type === 'vcard' && 'Contacto'}
                                {qr.qr_type === 'wifi'  && 'Red WiFi'}
                                {qr.qr_type === 'pdf'   && 'Documento PDF'}
                            </div>
                            <p className="text-sm font-medium text-gray-800 truncate">{contentSummary()}</p>
                        </div>

                        {/* Last scan */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Clock size={13} /> Último escaneo
                            </div>
                            <p className="text-xs font-medium text-gray-700 leading-relaxed">{formatDate(qr.last_scan)}</p>
                        </div>

                        {/* Slug */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:col-span-3 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Hash size={13} /> Slug de redirección
                            </div>
                            <p className="text-sm font-mono text-gray-700 break-all">/r/{qr.slug}</p>
                        </div>
                    </div>
                </div>

                {/* PDF section — only for pdf type */}
                {qr.qr_type === 'pdf' && (
                    <div
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6
                            animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={15} className="text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-900">Documento PDF</h3>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Current PDF */}
                            <div className="flex flex-col gap-2">
                                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 p-2">
                                    <FileText size={28} className="text-gray-300" />
                                    <span className="text-[10px] text-gray-400 text-center leading-tight break-all line-clamp-2">
                                        {qr.meta?.pdf_name || '—'}
                                    </span>
                                </div>
                                {qr.destination_url && (
                                    <a
                                        href={qr.destination_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition-colors justify-center"
                                    >
                                        <ExternalLink size={11} /> Ver PDF
                                    </a>
                                )}
                            </div>

                            {/* Replace form */}
                            <form onSubmit={uploadPdf} className="flex-1 space-y-3">
                                <div>
                                    <input
                                        ref={pdfInputRef}
                                        type="file"
                                        accept="application/pdf"
                                        onChange={e => setPdfFile(e.target.files[0] || null)}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => pdfInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                                    >
                                        <FileText size={14} />
                                        {pdfFile ? pdfFile.name : 'Seleccionar nuevo PDF'}
                                    </button>
                                    <p className="text-xs text-gray-400 mt-1.5">Reemplaza el PDF actual. El QR no cambia. Máximo 5 MB.</p>
                                </div>
                                {pdfFile && (
                                    <button
                                        type="submit"
                                        disabled={uploadingPdf}
                                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-60"
                                    >
                                        {uploadingPdf ? <><Loader2 size={14} className="animate-spin" /> Subiendo...</> : <><FileText size={14} /> Guardar PDF</>}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                )}

                {/* Logo section */}
                <div
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6
                        animate-in fade-in slide-in-from-bottom-3 duration-500"
                    style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <ImagePlus size={15} className="text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-900">Logo del QR</h3>
                        <span className="text-xs text-gray-400">(opcional)</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Current logo / preview */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                {currentLogo ? (
                                    <img src={currentLogo} alt="Logo QR" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <ImagePlus size={24} className="text-gray-300" />
                                )}
                            </div>
                            {qr.logo_url && !logoPreview && (
                                <button
                                    type="button"
                                    onClick={removeLogo}
                                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 size={12} /> Quitar logo
                                </button>
                            )}
                        </div>

                        {/* Upload form */}
                        <form onSubmit={uploadLogo} className="flex-1 space-y-3">
                            <div>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                                    onChange={handleLogoFile}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => logoInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    <ImagePlus size={14} />
                                    {logoFile ? logoFile.name : 'Seleccionar imagen'}
                                </button>
                                <p className="text-xs text-gray-400 mt-1.5">PNG, JPG o WebP. Máximo 1 MB.</p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-xs font-medium text-gray-600">Tamaño del logo</label>
                                    <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-200">{logoSize}%</span>
                                </div>
                                <input
                                    type="range" min="10" max="50" step="5"
                                    value={logoSize}
                                    onChange={e => setLogoSize(parseInt(e.target.value))}
                                    className="w-full max-w-xs accent-black"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1 max-w-xs"><span>10%</span><span>50%</span></div>
                            </div>

                            {logoChanged && (
                                <button
                                    type="submit"
                                    disabled={uploadingLogo}
                                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-60"
                                >
                                    {uploadingLogo ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : <><ImagePlus size={14} /> Guardar logo</>}
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Edit form */}
                {editing && (
                    <form
                        onSubmit={save}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6
                            animate-in fade-in slide-in-from-bottom-4 duration-300"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <Palette size={15} className="text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-900">Editar QR</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Nombre */}
                            <div className={qr.qr_type === 'url' ? '' : 'sm:col-span-2'}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                                <input value={data.name} onChange={e => setData('name', e.target.value)} onBlur={() => touch('name')} className={inputClass('name')} />
                                {allErrors.name && <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">{allErrors.name}</p>}
                            </div>

                            {/* URL destino — hidden for PDF (managed via upload) */}
                            {qr.qr_type === 'url' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">URL destino</label>
                                    <input
                                        value={data.destination_url}
                                        onChange={e => setData('destination_url', e.target.value)}
                                        onBlur={() => {
                                            touch('destination_url');
                                            const val = data.destination_url.trim();
                                            if (val && !val.match(/^https?:\/\//i)) setData('destination_url', 'https://' + val);
                                        }}
                                        className={inputClass('destination_url')}
                                    />
                                    {allErrors.destination_url && <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">{allErrors.destination_url}</p>}
                                </div>
                            )}

                            {/* vCard fields */}
                            {qr.qr_type === 'vcard' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                                        <input value={data.vc_first_name} onChange={e => setData('vc_first_name', e.target.value)} onBlur={() => touch('vc_first_name')} className={inputClass('vc_first_name')} placeholder="Ana" />
                                        {allErrors.vc_first_name && <p className="text-red-500 text-xs mt-1">{allErrors.vc_first_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Apellidos</label>
                                        <input value={data.vc_last_name} onChange={e => setData('vc_last_name', e.target.value)} className={inputClass(false)} placeholder="García López" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                                        <input value={data.vc_phone} onChange={e => setData('vc_phone', e.target.value)} className={inputClass(false)} placeholder="+34 600 000 000" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                        <input type="email" value={data.vc_email} onChange={e => setData('vc_email', e.target.value)} className={inputClass(false)} placeholder="ana@empresa.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Empresa</label>
                                        <input value={data.vc_company} onChange={e => setData('vc_company', e.target.value)} className={inputClass(false)} placeholder="Empresa S.L." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Sitio web</label>
                                        <input value={data.vc_website} onChange={e => setData('vc_website', e.target.value)} className={inputClass(false)} placeholder="https://empresa.com" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Dirección</label>
                                        <input value={data.vc_address} onChange={e => setData('vc_address', e.target.value)} className={inputClass(false)} placeholder="Calle Mayor 1, 28001 Madrid" />
                                    </div>
                                </>
                            )}

                            {/* WiFi fields */}
                            {qr.qr_type === 'wifi' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre de la red (SSID) *</label>
                                        <input value={data.wifi_ssid} onChange={e => setData('wifi_ssid', e.target.value)} onBlur={() => touch('wifi_ssid')} className={inputClass('wifi_ssid')} placeholder="MiRedWiFi" />
                                        {allErrors.wifi_ssid && <p className="text-red-500 text-xs mt-1">{allErrors.wifi_ssid}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
                                        <input type="password" value={data.wifi_password} onChange={e => setData('wifi_password', e.target.value)} className={inputClass(false)} placeholder="••••••••" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Seguridad</label>
                                        <select value={data.wifi_security} onChange={e => setData('wifi_security', e.target.value)} className={inputClass(false)}>
                                            <option value="WPA">WPA / WPA2</option>
                                            <option value="WEP">WEP</option>
                                            <option value="nopass">Sin contraseña</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center pt-5">
                                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                            <input type="checkbox" checked={data.wifi_hidden} onChange={e => setData('wifi_hidden', e.target.checked)} className="w-4 h-4 rounded border-gray-300 accent-black" />
                                            <span className="text-sm text-gray-600">Red oculta</span>
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* Design */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Color principal</label>
                                <ColorPicker label="Color principal" value={data.fg_color} onChange={v => setData('fg_color', v)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fondo</label>
                                <ColorPicker label="Fondo" value={data.bg_color} onChange={v => setData('bg_color', v)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estilo de puntos</label>
                                <select value={data.dot_style} onChange={e => setData('dot_style', e.target.value)} className={inputClass(false)}>
                                    <option value="square">Cuadrado</option>
                                    <option value="rounded">Redondeado</option>
                                    <option value="dots">Puntos</option>
                                    <option value="classy">Classy</option>
                                    <option value="classy-rounded">Classy redondeado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estilo de esquinas</label>
                                <select value={data.corner_style} onChange={e => setData('corner_style', e.target.value)} className={inputClass(false)}>
                                    <option value="square">Cuadrado</option>
                                    <option value="extra-rounded">Redondeado</option>
                                    <option value="dot">Punto</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2 flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-60"
                                >
                                    {processing ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : <><Save size={15} /> Guardar cambios</>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                                >
                                    <X size={15} /> Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* ── Charts ── */}

                {/* Timeline */}
                {stats.timeline?.length > 0 && (
                    <div
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6
                            animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{ animationDelay: '180ms', animationFillMode: 'backwards' }}
                    >
                        <h3 className="text-sm font-semibold text-gray-700 mb-5">Escaneos — últimos 30 días</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={stats.timeline}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,.05)' }} />
                                <Line type="monotone" dataKey="count" name="Escaneos" stroke="#000" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#000' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Grid of charts */}
                {((stats.devices?.length > 0) || (stats.browsers?.length > 0) || (stats.os?.length > 0) || (stats.countries?.length > 0) || (stats.cities?.length > 0)) && (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
                            animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{ animationDelay: '240ms', animationFillMode: 'backwards' }}
                    >
                        {/* Devices */}
                        {stats.devices?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center gap-1.5 mb-4">
                                    <Monitor size={14} className="text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-700">Dispositivos</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={140}>
                                    <PieChart>
                                        <Pie
                                            data={stats.devices.map(d => ({ ...d, device: deviceLabel(d.device) }))}
                                            dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={60}
                                        >
                                            {stats.devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
                                    {stats.devices.map((d, i) => {
                                        const total = stats.devices.reduce((s, x) => s + x.count, 0);
                                        const pct = total ? Math.round((d.count / total) * 100) : 0;
                                        return (
                                            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                <span>{deviceLabel(d.device)}</span>
                                                <span className="text-gray-400 font-mono">{pct}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Browsers */}
                        {stats.browsers?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center gap-1.5 mb-5">
                                    <Globe size={14} className="text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-700">Navegadores</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={stats.browsers.map(b => ({ ...b, browser: translate(b.browser) }))} layout="vertical" margin={{ left: 0, right: 8 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <YAxis dataKey="browser" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '12px' }} />
                                        <Bar dataKey="count" name="Escaneos" fill="#000" radius={[0, 6, 6, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* OS */}
                        {stats.os?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center gap-1.5 mb-5">
                                    <Monitor size={14} className="text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-700">Sistema operativo</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={stats.os.map(o => ({ ...o, os: translate(o.os) }))} layout="vertical" margin={{ left: 0, right: 8 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <YAxis dataKey="os" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '12px' }} />
                                        <Bar dataKey="count" name="Escaneos" fill="#374151" radius={[0, 6, 6, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Countries */}
                        {stats.countries?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center gap-1.5 mb-5">
                                    <Globe size={14} className="text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-700">Top países</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={stats.countries.map(c => ({ ...c, country: translate(c.country) }))} layout="vertical" margin={{ left: 0, right: 8 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <YAxis dataKey="country" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={90} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '12px' }} />
                                        <Bar dataKey="count" name="Escaneos" fill="#6B7280" radius={[0, 6, 6, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Cities */}
                        {stats.cities?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center gap-1.5 mb-5">
                                    <MapPin size={14} className="text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-700">Top ciudades</h3>
                                </div>
                                <div className="space-y-2.5">
                                    {stats.cities.map((c, i) => {
                                        const max = stats.cities[0]?.count || 1;
                                        const pct = Math.round((c.count / max) * 100);
                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500 w-24 truncate flex-shrink-0">{translate(c.city)}</span>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-xs font-mono text-gray-500 w-6 text-right flex-shrink-0">{c.count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty stats state */}
                {!stats.timeline?.length && !stats.devices?.length && (
                    <div
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center
                            animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{ animationDelay: '180ms', animationFillMode: 'backwards' }}
                    >
                        <ScanLine size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-500">Sin escaneos todavía</p>
                        <p className="text-xs text-gray-400 mt-1">Comparte tu QR para empezar a ver estadísticas.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
