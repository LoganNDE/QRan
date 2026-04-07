import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { toast, Toaster } from 'react-hot-toast';
import ColorPicker from '@/Components/ColorPicker';
import { Link2, Tag, Palette, Loader2, Download, ArrowRight } from 'lucide-react';

const PREVIEW_SIZE = 250;

const defaultOptions = {
    width: 300, height: 300, type: 'svg',
    data: 'https://example.com',
    dotsOptions: { color: '#000000', type: 'square' },
    cornersSquareOptions: { type: 'square' },
    backgroundOptions: { color: '#FFFFFF' },
    imageOptions: { crossOrigin: 'anonymous', margin: 4 },
};

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

export default function QrCreate() {
    const qrRef = useRef(null);
    const qrInstance = useRef(null);
    const [clientErrors, setClientErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        destination_url: 'https://',
        fg_color: '#000000',
        bg_color: '#FFFFFF',
        dot_style: 'square',
        corner_style: 'square',
        qr_size: 300,
        error_correction: 'M',
    });

    useEffect(() => {
        qrInstance.current = new QRCodeStyling(defaultOptions);
        if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrInstance.current.append(qrRef.current);
        }
    }, []);

    useEffect(() => {
        if (qrInstance.current) {
            qrInstance.current.update({
                data: data.destination_url || 'https://example.com',
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
            const visibleErrs = {};
            Object.keys(touched).forEach(k => { if (errs[k]) visibleErrs[k] = errs[k]; });
            setClientErrors(visibleErrs);
        }
    }, [data]);

    const touch = (field) => setTouched(t => ({ ...t, [field]: true }));

    const submit = (e) => {
        e.preventDefault();
        const errs = validate(data);
        if (Object.keys(errs).length > 0) {
            setClientErrors(errs);
            setTouched({ name: true, destination_url: true });
            toast.error('Corrige los errores antes de continuar.');
            return;
        }
        post(route('qr.store'), {
            onError: () => toast.error('Error al crear el QR.'),
        });
    };

    const download = (ext) => {
        qrInstance.current?.download({ name: data.name || 'qr', extension: ext });
    };

    const scale = data.qr_size <= PREVIEW_SIZE ? 1 : PREVIEW_SIZE / data.qr_size;

    // Merge server + client errors (client takes priority)
    const allErrors = { ...errors, ...clientErrors };

    const inputClass = (field) =>
        `w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200
        focus:ring-2 focus:ring-black/10 focus:border-black/30
        ${allErrors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`;

    return (
        <AuthenticatedLayout>
            <Head title="Crear QR" />
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Crear nuevo QR</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Personaliza tu QR y empieza a compartirlo</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Form */}
                    <form
                        onSubmit={submit}
                        className="lg:col-span-3 space-y-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6
                            animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: '60ms', animationFillMode: 'backwards' }}
                    >
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                <span className="flex items-center gap-1.5"><Tag size={14} className="text-gray-400" />Nombre del QR</span>
                            </label>
                            <input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                onBlur={() => touch('name')}
                                className={inputClass('name')}
                                placeholder="Mi QR de producto"
                            />
                            {allErrors.name && (
                                <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {allErrors.name}
                                </p>
                            )}
                        </div>

                        {/* URL */}
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
                            {allErrors.destination_url && (
                                <p className="text-red-500 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {allErrors.destination_url}
                                </p>
                            )}
                        </div>

                        {/* Colores */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="flex items-center gap-1.5"><Palette size={14} className="text-gray-400" />Colores</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <ColorPicker
                                    label="Color principal"
                                    value={data.fg_color}
                                    onChange={v => setData('fg_color', v)}
                                />
                                <ColorPicker
                                    label="Fondo"
                                    value={data.bg_color}
                                    onChange={v => setData('bg_color', v)}
                                />
                            </div>
                        </div>

                        {/* Estilos */}
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>

                        {/* Tamaño */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-700">Tamaño de descarga</label>
                                <span className="text-sm font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-200">{data.qr_size}px</span>
                            </div>
                            <input
                                type="range" min="150" max="600" step="10"
                                value={data.qr_size}
                                onChange={e => setData('qr_size', parseInt(e.target.value))}
                                className="w-full accent-black"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>150px</span><span>600px</span>
                            </div>
                        </div>

                        {/* Corrección de error */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Corrección de error</label>
                            <select value={data.error_correction} onChange={e => setData('error_correction', e.target.value)} className={inputClass(false)}>
                                <option value="L">L — Baja (7%)</option>
                                <option value="M">M — Media (15%)</option>
                                <option value="Q">Q — Alta (25%)</option>
                                <option value="H">H — Máxima (30%)</option>
                            </select>
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

                    {/* Preview */}
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
