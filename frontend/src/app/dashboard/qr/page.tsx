"use client";

import { useState, useEffect } from "react";
import {
    QrCode,
    Plus,
    Trash2,
    Download,
    ExternalLink,
    MapPin,
    Tag,
    ToggleLeft,
    ToggleRight,
    Loader2,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

export default function QRManagementPage() {
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newQr, setNewQr] = useState({ label: "", type: "visitor" });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchQRs();
    }, []);

    const fetchQRs = async () => {
        try {
            const response = await axios.get("http://localhost:8000/qrs/");
            setQrs(response.data);
        } catch (err) {
            console.error("Failed to fetch QRs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setError(null);
        try {
            const url = `http://localhost:3000/${newQr.type}-entry?qr=temp-uuid`;
            const response = await axios.post("http://localhost:8000/qrs/", {
                ...newQr,
                url: url // Backend will generate the actual ID, we'll update the URL if needed
            });

            // Update the URL with the actual ID from backend
            const finalUrl = `http://localhost:3000/${newQr.type}-entry?qr=${response.data.id}`;
            await axios.patch(`http://localhost:8000/qrs/${response.data.id}/toggle`, {}); // Just to trigger a referesh/save if needed, or we should have handled this in backend

            setNewQr({ label: "", type: "visitor" });
            fetchQRs();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create QR code.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this QR code?")) return;
        try {
            await axios.delete(`http://localhost:8000/qrs/${id}`);
            fetchQRs();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const toggleQR = async (id: string) => {
        try {
            await axios.patch(`http://localhost:8000/qrs/${id}/toggle`);
            fetchQRs();
        } catch (err) {
            console.error("Toggle failed:", err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">QR Management</h1>
                    <p className="text-slate-500">Generate and manage entry point QR codes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create QR Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-indigo-600" /> Create New QR
                        </h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Location Label</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Main Gate, Reception"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={newQr.label}
                                    onChange={(e) => setNewQr({ ...newQr, label: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">QR Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewQr({ ...newQr, type: 'visitor' })}
                                        className={cn(
                                            "py-2 px-4 rounded-xl text-sm font-bold border transition-all",
                                            newQr.type === 'visitor'
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        Visitor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewQr({ ...newQr, type: 'vehicle' })}
                                        className={cn(
                                            "py-2 px-4 rounded-xl text-sm font-bold border transition-all",
                                            newQr.type === 'vehicle'
                                                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100"
                                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        Vehicle
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                            >
                                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                                Generate QR Code
                            </button>
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* QR List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="p-12 bg-white rounded-2xl border border-slate-200 border-dashed text-center text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 opacity-20" />
                            Loading QR codes...
                        </div>
                    ) : qrs.length === 0 ? (
                        <div className="p-12 bg-white rounded-2xl border border-slate-200 border-dashed text-center text-slate-400">
                            No QR codes generated yet. Create your first one above.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {qrs.map((qr: any) => (
                                <div key={qr.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                    <div className={cn(
                                        "absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rotate-45 opacity-10",
                                        qr.type === 'visitor' ? "bg-indigo-600" : "bg-emerald-600"
                                    )} />

                                    <div className="flex gap-4">
                                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                                            <QRCodeSVG value={qr.url} size={80} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                                    qr.type === 'visitor' ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                                                )}>
                                                    {qr.type}
                                                </span>
                                                {!qr.is_active && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {qr.label}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-1 truncate">{qr.url}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleQR(qr.id)}
                                                className={cn(
                                                    "p-2 rounded-lg transition-colors",
                                                    qr.is_active ? "text-indigo-600 bg-indigo-50" : "text-slate-400 bg-slate-50"
                                                )}
                                            >
                                                {qr.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all">
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(qr.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
