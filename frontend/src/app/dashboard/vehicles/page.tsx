"use client";

import { useState, useEffect } from "react";
import {
    Truck,
    Search,
    Filter,
    Calendar as CalendarIcon,
    ChevronRight,
    Download,
    ShieldCheck,
    ShieldAlert,
    Clock,
    Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { json2csv } from "json-2-csv";

export default function VehicleLogPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [permittedFilter, setPermittedFilter] = useState("all");

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get("http://localhost:8000/entries/vehicles");
                setVehicles(response.data);
            } catch (error) {
                console.error("Failed to fetch vehicles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const handleExport = () => {
        try {
            const csv = json2csv(filteredVehicles);
            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("download", `vehicle_log_${new Date().toISOString().split('T')[0]}.csv`);
            a.click();
        } catch (err) {
            console.error("Export failed:", err);
        }
    };

    const filteredVehicles = vehicles.filter((v: any) => {
        const matchesSearch = v.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.driver_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPermitted = permittedFilter === "all" ||
            (permittedFilter === "true" ? v.permitted : !v.permitted);
        return matchesSearch && matchesPermitted;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vehicle Log</h1>
                    <p className="text-slate-500">Track all material and transport movement</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search vehicle no. or driver..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                        value={permittedFilter}
                        onChange={(e) => setPermittedFilter(e.target.value)}
                    >
                        <option value="all">All Entries</option>
                        <option value="true">Permitted Only</option>
                        <option value="false">Unauthorized Only</option>
                    </select>
                </div>
                <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle No.</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Driver</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Entry Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Auth Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading vehicle logs...</td>
                                </tr>
                            ) : filteredVehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No vehicle movements found.</td>
                                </tr>
                            ) : (
                                filteredVehicles.map((vehicle: any) => (
                                    <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-bold bg-slate-900 text-white uppercase tracking-wider">
                                                {vehicle.vehicle_number}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{vehicle.driver_name}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-500 text-sm">{vehicle.vehicle_type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(vehicle.entry_time).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {vehicle.permitted ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                                                    <ShieldCheck className="w-4 h-4" /> Permitted
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs uppercase tracking-widest">
                                                    <ShieldAlert className="w-4 h-4" /> Unauthorized
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
