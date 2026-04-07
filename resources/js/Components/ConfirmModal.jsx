import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirmar', danger = true, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4 mb-5">
                    {danger && (
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={18} className="text-red-500" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 break-words">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed break-words">{message}</p>
                    </div>
                </div>

                <div className="flex gap-2.5 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm text-white rounded-xl active:scale-[0.98] transition-all ${
                            danger
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-black hover:bg-gray-800'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
