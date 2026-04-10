import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { toast, Toaster } from 'react-hot-toast';
import ColorPicker from '@/Components/ColorPicker';
import { Link2, Tag, Palette, Loader2, Download, ArrowRight, User, Wifi, Globe } from 'lucide-react';

const PREVIEW_SIZE = 250;

const TYPE_OPTIONS = [
    { value: 'url',   label: 'URL',   icon: Globe, desc: 'Enlace web dinámico' },
    { value: 'vcard', label: 'vCard', icon: User,  desc: 'Tarjeta de contacto' },
    { value: 'wifi',  label: 'WiFi',  icon: Wifi,  desc: 'Red inalámbrica' },
];

function buildVCard(d) {
    const full = [d.vc_first_name, d.vc_last_name].filter(Boolean).join(' ') || 'Contacto';
    let v = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${full}\r\nN:${d.vc_last_name || ''};${d.vc_first_name || ''};;;\r\n`;
    if (d.vc_phone)   v += `TEL;TYPE=CELL:${d.vc_phone}\r\n`;
    if (d.vc_email)   v += `EMAIL:${d.vc_email}\r\n`;
    if (d.vc_company) v += `ORG:${d.vc_company}\r\n`;
    if (d.vc_website) v += `URL:${d.vc_website}\r\n`;
    if (d.vc_address) v += `ADR:;;${d.vc_address};;;;\r\n`;
    return v + 'END:VCARD';
}

function buildWifi(d) {
    const esc = s => String(s || '').replace(/([\\;,":])/, '\\$1');
    return `WIFI:T:${d.wifi_security || 'WPA'};S:${esc(d.wifi_ssid)};P:${esc(d.wifi_password)};H:${d.wifi_hidden ? 'true' : 'false'};;`;
}

function validateByType(data) {
    const errs = {};
    if (!data.name.trim()) errs.name = 'El nombre es obligatorio.';
    else if (data.name.trim().length > 100) errs.name = 'Máximo 100 caracteres.';

    if (data.qr_type === 'url') {
        if (!data.destination_url.trim()) {
            errs.destination_url = 'La URL es obligatoria.';
        } else {
            try { new URL(data.destination_url); }
            catch { errs.destination_url = 'Introduce una URL válida (ej: https://ejemplo.com).'; }
        }
    } else if (data.qr_type === 'vcard') {
        if (!data.vc_first_name.trim()) errs.vc_first_name = 'El nombre es obligatorio.';
    } else if (data.qr_type === 'wifi') {
        if (!data.wifi_ssid.trim()) errs.wifi_ssid = 'El nombre de la red es obligatorio.';
    }
    return errs;
}

export default function QrCreate() {
    const qrRef      = useRef(null);
    const qrInstance = useRef(null);
    const [clientErrors, setClientErrors] = useState({});
    const [touched, setTouched]           = useState({});

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        qr_type: 'url',
        // URL
        destination_url: 'https://',
        // vCard
        vc_first_name: '', vc_last_name: '', vc_phone: '',
        vc_email: '', vc_company: '', vc_website: '', vc_address: '',
        // WiFi
        wifi_ssid: '', wifi_password: '', wifi_security: 'WPA', wifi_hidden: false,
        // Design
        fg_color: '#000000', bg_color: '#FFFFFF',
        dot_style: 'square', corner_style: 'square',
        qr_size: 300, error_correction: 'M',
    });

    const qrPreviewData = useMemo(() => {
        if (data.qr_type === 'url')   return data.destination_url || 'https://example.com';
        if (data.qr_type === 'vcard') return buildVCard(data);
        return buildWifi(data);
    }, [
        data.qr_type, data.destination_url,
        data.vc_first_name, data.vc_last_name, data.vc_phone,
        data.vc_email, data.vc_company, data.vc_website, data.vc_address,
        data.wifi_ssid, data.wifi_password, data.wifi_security, data.wifi_hidden,
    ]);

    useEffect(() => {
        qrInstance.current = new QRCodeStyling({
            width: 300, height: 300, type: 'svg',
            data: qrPreviewData,
            dotsOptions: { color: '#000000', type: 'square' },
            cornersSquareOptions: { type: 'square' },
            backgroundOptions: { color: '#FFFFFF' },
            imageOptions: { crossOrigin: 'anonymous', margin: 4 },
        });
        if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrInstance.current.append(qrRef.current);
        }
    }, []);

    useEffect(() => {
        qrInstance.current?.update({
            data: qrPreviewData,
            dotsOptions:          { color: data.fg_color,    type: data.dot_style },
            cornersSquareOptions: { type: data.corner_style },
            backgroundOptions:    { color: data.bg_color },
            width:  data.qr_size,
            height: data.qr_size,
        });
    }, [qrPreviewData, data.fg_color, data.bg_color, data.dot_style, data.corner_style, data.qr_size]);

    useEffect(() => {
        if (Object.keys(touched).length > 0) {
            const errs = validateByType(data);
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
        focus:ring-2 focus:ring-black/10 focus:border-black/30
        ${allErrors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`;

    const submit = (e) => {
        e.preventDefault();
        const errs = validateByType(data);
        if (Object.keys(errs).length > 0) {
            setClientErrors(errs);
            const t = {};
            Object.keys(errs).forEach(k => t[k] = true);
            setTouched(t);
            toast.error('Corrige los errores antes de continuar.');
            return;
        }
        post(route('qr.store'), { onError: () => toast.error('Error al crear el QR.') });
    };

    const download = (ext) => qrInstance.current?.download({ name: data.name || 'qr', extension: ext });

    return (
        <AuthenticatedLayout>
            <Head title="Crear QR" />
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Crear nuevo QR</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Elige el tipo de QR y personaliza su diseño</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <form
                        onSubmit={submit}
                        className="lg:col-span-3 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: '60ms', animationFillMode: 'backwards' }}
                    >
                        {/* ── Tipo de QR ── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de QR</label>
                            <div className="grid grid-cols-3 gap-2">
                                {TYPE_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setData('qr_type', value)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-150 ${
                                            data.qr_type === value
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="text-xs font-semibold">{label}</span>
                                        <span className={`text-[10px] leading-tight ${data.qr_type === value ? 'text-gray-300' : 'text-gray-400'}`}>{desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Contenido ── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                            {/* Nombre siempre visible */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <span className="flex items-center gap-1.5"><Tag size={14} className="text-gray-400" />Nombre del QR</span>
                                </label>
                                <input
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    onBlur={() => touch('name')}
                                    className={inputClass('name')}
                                    placeholder="Ej: Mi QR de producto"
                                />
                                {allErrors.name && <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">{allErrors.name}</p>}
                            </div>

                            {/* URL */}
                            {data.qr_type === 'url' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <span className="flex items-center gap-1.5"><Link2 size={14} className="text-gray-400" />URL destino</span>
                                    </label>
                                    <input
                                        value={data.destination_url}
                                        onChange={e => setData('destination_url', e.target.value)}
                                        onBlur={() => touch('destination_url')}
                                        className={inputClass('destination_url')}
                                        placeholder="https://tutienda.com"
                                    />
                                    {allErrors.destination_url && <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">{allErrors.destination_url}</p>}
                                    <p className="text-xs text-gray-400 mt-1.5">El destino es editable en cualquier momento sin regenerar el QR.</p>
                                </div>
                            )}

                            {/* vCard */}
                            {data.qr_type === 'vcard' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                                            <input value={data.vc_first_name} onChange={e => setData('vc_first_name', e.target.value)} onBlur={() => touch('vc_first_name')} className={inputClass('vc_first_name')} placeholder="Ana" />
                                            {allErrors.vc_first_name && <p className="text-red-500 text-xs mt-1">{allErrors.vc_first_name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Apellidos</label>
                                            <input value={data.vc_last_name} onChange={e => setData('vc_last_name', e.target.value)} className={inputClass(false)} placeholder="García López" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                                            <input value={data.vc_phone} onChange={e => setData('vc_phone', e.target.value)} className={inputClass(false)} placeholder="+34 600 000 000" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                            <input type="email" value={data.vc_email} onChange={e => setData('vc_email', e.target.value)} className={inputClass(false)} placeholder="ana@empresa.com" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Empresa</label>
                                            <input value={data.vc_company} onChange={e => setData('vc_company', e.target.value)} className={inputClass(false)} placeholder="Empresa S.L." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Sitio web</label>
                                            <input value={data.vc_website} onChange={e => setData('vc_website', e.target.value)} className={inputClass(false)} placeholder="https://empresa.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Dirección</label>
                                        <input value={data.vc_address} onChange={e => setData('vc_address', e.target.value)} className={inputClass(false)} placeholder="Calle Mayor 1, 28001 Madrid" />
                                    </div>
                                    <p className="text-xs text-gray-400">Al escanear el QR, el móvil descargará automáticamente la tarjeta de contacto.</p>
                                </div>
                            )}

                            {/* WiFi */}
                            {data.qr_type === 'wifi' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre de la red (SSID) *</label>
                                        <input value={data.wifi_ssid} onChange={e => setData('wifi_ssid', e.target.value)} onBlur={() => touch('wifi_ssid')} className={inputClass('wifi_ssid')} placeholder="MiRedWiFi" />
                                        {allErrors.wifi_ssid && <p className="text-red-500 text-xs mt-1">{allErrors.wifi_ssid}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
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
                                    </div>
                                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                        <input type="checkbox" checked={data.wifi_hidden} onChange={e => setData('wifi_hidden', e.target.checked)} className="w-4 h-4 rounded border-gray-300 accent-black" />
                                        <span className="text-sm text-gray-600">Red oculta</span>
                                    </label>
                                    <p className="text-xs text-gray-400">El QR codifica los datos WiFi directamente. Si cambias la contraseña, re-descarga el QR.</p>
                                </div>
                            )}
                        </div>

                        {/* ── Diseño ── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <Palette size={14} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Diseño</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <ColorPicker label="Color principal" value={data.fg_color} onChange={v => setData('fg_color', v)} />
                                <ColorPicker label="Fondo"           value={data.bg_color} onChange={v => setData('bg_color', v)} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Estilo de puntos</label>
                                    <select value={data.dot_style} onChange={e => setData('dot_style', e.target.value)} className={inputClass(false)}>
                                        <option value="square">Cuadrado</option>
                                        <option value="rounded">Redondeado</option>
                                        <option value="dots">Puntos</option>
                                        <option value="classy">Classy</option>
                                        <option value="classy-rounded">Classy redondeado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Estilo de esquinas</label>
                                    <select value={data.corner_style} onChange={e => setData('corner_style', e.target.value)} className={inputClass(false)}>
                                        <option value="square">Cuadrado</option>
                                        <option value="extra-rounded">Redondeado</option>
                                        <option value="dot">Punto</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-medium text-gray-600">Tamaño de descarga</label>
                                    <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-200">{data.qr_size}px</span>
                                </div>
                                <input type="range" min="150" max="600" step="10" value={data.qr_size} onChange={e => setData('qr_size', parseInt(e.target.value))} className="w-full accent-black" />
                                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>150px</span><span>600px</span></div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Corrección de error</label>
                                <select value={data.error_correction} onChange={e => setData('error_correction', e.target.value)} className={inputClass(false)}>
                                    <option value="L">L — Baja (7%)</option>
                                    <option value="M">M — Media (15%)</option>
                                    <option value="Q">Q — Alta (25%)</option>
                                    <option value="H">H — Máxima (30%)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-sm font-medium
                                hover:bg-gray-800 active:scale-[0.98] transition-all duration-150
                                disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {processing
                                ? <><Loader2 size={16} className="animate-spin" /> Creando QR...</>
                                : <>Crear QR <ArrowRight size={16} /></>
                            }
                        </button>
                    </form>

                    {/* ── Preview ── */}
                    <div
                        className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-5 h-fit lg:sticky lg:top-20
                            animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}
                    >
                        <div className="flex items-center justify-between w-full">
                            <h3 className="text-sm font-semibold text-gray-700">Vista previa</h3>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                                {data.qr_size}px al descargar
                            </span>
                        </div>

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

                        <div className="flex gap-2 w-full">
                            <button type="button" onClick={() => download('png')}
                                className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <Download size={14} /> PNG
                            </button>
                            <button type="button" onClick={() => download('svg')}
                                className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <Download size={14} /> SVG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
