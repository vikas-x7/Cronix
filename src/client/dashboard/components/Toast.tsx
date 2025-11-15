"use client";

import React, { useEffect } from "react";
import { useUIStore, type Toast as ToastType } from "@/client/stores/uiStore";
import { FiCheck, FiX, FiInfo } from "react-icons/fi";

function ToastItem({ toast }: { toast: ToastType }) {
    const removeToast = useUIStore((s) => s.removeToast);

    useEffect(() => {
        const timer = setTimeout(() => removeToast(toast.id), 4000);
        return () => clearTimeout(timer);
    }, [toast.id, removeToast]);

    const iconMap = {
        success: <FiCheck size={14} />,
        error: <FiX size={14} />,
        info: <FiInfo size={14} />,
    };

    const colorMap = {
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        error: "border-red-200 bg-red-50 text-red-800",
        info: "border-blue-200 bg-blue-50 text-blue-800",
    };

    return (
        <div
            className={`flex items-center gap-2 border px-4 py-2.5 text-[12px] font-medium shadow-sm animate-in slide-in-from-top-2 ${colorMap[toast.type]}`}
        >
            {iconMap[toast.type]}
            {toast.message}
            <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto opacity-50 hover:opacity-100"
            >
                <FiX size={12} />
            </button>
        </div>
    );
}

export default function ToastContainer() {
    const toasts = useUIStore((s) => s.toasts);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}
