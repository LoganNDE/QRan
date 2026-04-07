import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const PRESETS = [
    '#000000', '#374151', '#6B7280', '#D1D5DB',
    '#ffffff', '#FEF3C7', '#FEE2E2', '#DCFCE7',
    '#EFF6FF', '#F3E8FF', '#FDF4FF', '#FFEDD5',
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
];

export default function ColorPicker({ value, onChange, label }) {
    const [open, setOpen] = useState(false);
    const [hex, setHex] = useState(value);
    const containerRef = useRef(null);
    const nativeRef = useRef(null);

    // Sync hex input when value changes from outside
    useEffect(() => { setHex(value); }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const apply = (color) => {
        setHex(color);
        onChange(color);
    };

    const handleHexInput = (e) => {
        const v = e.target.value;
        setHex(v);
        if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-3 w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 hover:border-gray-300 transition-colors text-left"
            >
                <span
                    className="w-6 h-6 rounded-lg flex-shrink-0 border border-black/10"
                    style={{ backgroundColor: value }}
                />
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
                    <p className="text-xs font-mono font-medium text-gray-700">{value.toUpperCase()}</p>
                </div>
                <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg p-3.5 z-30 w-56 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Presets grid */}
                    <p className="text-xs text-gray-400 mb-2 font-medium">Colores</p>
                    <div className="grid grid-cols-5 gap-1.5 mb-3">
                        {PRESETS.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => apply(c)}
                                className="relative w-8 h-8 rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black/20"
                                style={{
                                    backgroundColor: c,
                                    boxShadow: c === '#ffffff' || c === '#FEF3C7' || c === '#FEE2E2' || c === '#DCFCE7' || c === '#EFF6FF' || c === '#F3E8FF' || c === '#FDF4FF' || c === '#FFEDD5'
                                        ? 'inset 0 0 0 1px #e5e7eb'
                                        : undefined,
                                }}
                                title={c}
                            >
                                {value.toLowerCase() === c.toLowerCase() && (
                                    <Check
                                        size={12}
                                        className={`absolute inset-0 m-auto ${
                                            c === '#ffffff' || c.startsWith('#F') || c.startsWith('#D') || c.startsWith('#E')
                                                ? 'text-gray-600' : 'text-white'
                                        }`}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Custom hex + native picker */}
                    <div className="border-t border-gray-100 pt-3">
                        <p className="text-xs text-gray-400 mb-2 font-medium">Personalizado</p>
                        <div className="flex gap-2 items-center">
                            <button
                                type="button"
                                onClick={() => nativeRef.current?.click()}
                                className="w-8 h-8 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 hover:border-gray-400 transition-colors"
                                style={{ backgroundColor: value }}
                                title="Abrir selector de color"
                            />
                            <input
                                type="color"
                                ref={nativeRef}
                                value={value}
                                onChange={e => apply(e.target.value)}
                                className="sr-only"
                            />
                            <input
                                type="text"
                                value={hex}
                                onChange={handleHexInput}
                                className="flex-1 text-xs font-mono border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 uppercase"
                                placeholder="#000000"
                                maxLength={7}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
