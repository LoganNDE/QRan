import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { toast, Toaster } from 'react-hot-toast';
import ColorPicker from '@/Components/ColorPicker';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
    ArrowLeft, Copy, Download, ScanLine, Link2, Hash,
    Pencil, X, Save, Loader2, ToggleLeft, ToggleRight, Palette
} from 'lucide-react';

function validate(data) {
    const errs = {};
    if (!data.name.trim()) errs.name = 'El nombre es obligatorio.';
    else if (data.name.trim().length > 100) errs.name = 'Máximo 100 caracteres.';
    if (!data.destination_url.trim()) {
        errs.destination_url = 'La URL es obligatoria.';
    } else {
        try { new URL(data.destination_url); }
        catch { errs.destination_url = 'Introduce una URL válida (ej: https://ejemplo.com).'; }
    }
    return errs;
}

const COLORS = ['#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'];
const PREVIEW_SIZE = 220;

export default function QrDetail({ qr, stats }) {
    const qrRef = useRef(null);
    const qrInstance = useRef(null);
    const [editing, setEditing] = useState(false);
    const [clientErrors, setClientErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { data, setData, put, processing, errors } = useForm({
        name: qr.name,
        destination_url: qr.destination_url,
        fg_color: qr.fg_color,
        bg_color: qr.bg_color,
        dot_style: qr.dot_style,
        corner_style: qr.corner_style,
        qr_size: qr.qr_size,
        error_correction: qr.error_correction,
    });

    const redirectUrl = `${window.location.origin}/r/${qr.slug}`;

    useEffect(() => {
        qrInstance.current = new QRCodeStyling({
            width: qr.qr_size, height: qr.qr_size,
            data: redirectUrl,
            dotsOptions: { color: qr.fg_color, type: qr.dot_style },
            cornersSquareOptions: { type: qr.corner_style },
            backgroundOptions: { color: qr.bg_color },
        });
        if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrInstance.current.append(qrRef.current);
        }
    }, []);

    useEffect(() => {
        if (qrInstance.current) {
            qrInstance.current.update({
                dotsOptions: { color: data.fg_color, type: data.dot_style },
                cornersSquareOptions: { type: data.corner_style },
                backgroundOptions: { color: data.bg_color },
                width: data.qr_size,
                height: data.qr_size,
            });
        }
    }, [data]);

    // Re-validate touched fields on change
    useEffect(() => {
        if (Object.keys(touched).length > 0) {
            const errs = validate(data);
            const visible = {};
            Object.keys(touched).forEach(k => { if (errs[k]) visible[k] = errs[k]; });
            setClientErrors(visible);
        }
    }, [data]);

    const touch = (field) => setTouched(t => ({ ...t, [field]: true }));

    const save = (e) => {
        e.preventDefault();
        const errs = validate(data);
        if (Object.keys(errs).length > 0) {
            setClientErrors(errs);
            setTouched({ name: true, destination_url: true });
            toast.error('Corrige los errores antes de guardar.');
            return;
        }
        put(route('qr.update', qr.id), {
            onSuccess: () => { toast.success('QR actualizado'); setEditing(false); setClientErrors({}); setTouched({}); },
            onError: () => toast.error('Error al actualizar'),
        });
    };

    const copy = () => navigator.clipboard.writeText(redirectUrl).then(() => toast.success('URL copiada'));
    const download = (ext) => qrInstance.current?.download({ name: qr.name, extension: ext });
    const toggle = () => {
        router.patch(route('qr.toggle', qr.id), {}, {
            onSuccess: () => toast.success(qr.is_active ? 'QR desactivado' : 'QR activado'),
        });
    };

    const scale = data.qr_size <= PREVIEW_SIZE ? 1 : PREVIEW_SIZE / data.qr_size;

    const allErrors = { ...errors, ...clientErrors };

    const inputClass = (field) =>
        `w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200
        focus:ring-2 focus:ring-black/10 focus:border-black/30 hover:border-gray-300
        ${allErrors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`;

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
                        {/* QR preview — overflow fix */}
                        <div
                            className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center"
                            style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
                        >
                            <div
                                ref={qrRef}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: `translate(-50%, -50%) scale(${scale})`,
                                    transformOrigin: 'center center',
                                }}
                            />
                        </div>

                        {/* Redirect URL */}
                        <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-500 truncate font-mono">{redirectUrl}</span>
                            <button onClick={copy} className="text-gray-400 hover:text-black transition-colors flex-shrink-0">
                                <Copy size={14} />
                            </button>
                        </div>

                        <div className="flex gap-2 w-full">
                            <button onClick={copy} className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2 rounded-xl text-xs hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <Copy size={13} /> Copiar
                            </button>
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
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <ScanLine size={13} /> Total escaneos
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{qr.scans_count ?? 0}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:col-span-2 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Link2 size={13} /> URL destino
                            </div>
                            <p className="text-sm font-medium text-gray-800 truncate">{qr.destination_url}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:col-span-3 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Hash size={13} /> Slug de redirección
                            </div>
                            <p className="text-sm font-mono text-gray-700">/r/{qr.slug}</p>
                        </div>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                                <input
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    onBlur={() => touch('name')}
                                    className={inputClass('name')}
                                />
                                {allErrors.name && (
                                    <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">{allErrors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL destino</label>
                                <input
                                    value={data.destination_url}
                                    onChange={e => setData('destination_url', e.target.value)}
                                    onBlur={() => touch('destination_url')}
                                    className={inputClass('destination_url')}
                                />
                                {allErrors.destination_url && (
                                    <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">{allErrors.destination_url}</p>
                                )}
                            </div>
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

                {/* Charts */}
                {stats.timeline.length > 0 && (
                    <div
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6
                            animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{ animationDelay: '180ms', animationFillMode: 'backwards' }}
                    >
                        <h3 className="text-sm font-semibold text-gray-700 mb-5">Escaneos últimos 30 días</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={stats.timeline}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,.05)' }} />
                                <Line type="monotone" dataKey="count" stroke="#000" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#000' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {(stats.devices.length > 0 || stats.countries.length > 0) && (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-5
                            animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{ animationDelay: '240ms', animationFillMode: 'backwards' }}
                    >
                        {stats.devices.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-5">Dispositivos</h3>
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie data={stats.devices} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={70}
                                            label={({ device, percent }) => `${device} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {stats.devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        {stats.countries.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-5">Top países</h3>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={stats.countries} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <YAxis dataKey="country" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} width={60} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }} />
                                        <Bar dataKey="count" fill="#000" radius={[0, 6, 6, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
