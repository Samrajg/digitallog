"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Truck,
    QrCode,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalVisitors: 0,
        totalVehicles: 0,
        pendingVisitors: 0,
        activeQRs: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [visitorsRes, vehiclesRes, qrsRes] = await Promise.all([
                    axios.get("http://localhost:8000/entries/visitors"),
                    axios.get("http://localhost:8000/entries/vehicles"),
                    axios.get("http://localhost:8000/qrs/")
                ]);

                setStats({
                    totalVisitors: visitorsRes.data.length,
                    totalVehicles: vehiclesRes.data.length,
                    pendingVisitors: visitorsRes.data.filter((v: any) => v.status === 'pending').length,
                    activeQRs: qrsRes.data.filter((q: any) => q.is_active).length
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { name: "Total Visitors", value: stats.totalVisitors, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Total Vehicles", value: stats.totalVehicles, icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50" },
        { name: "Pending Visitors", value: stats.pendingVisitors, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { name: "Active QR Points", value: stats.activeQRs, icon: QrCode, color: "text-indigo-600", bg: "bg-indigo-50" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
                <p className="text-slate-500">Real-time stats from all entry points</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all"
                    >
                        <div className={cn("p-3 rounded-xl transition-colors", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                                <span className="text-[10px] bg-green-50 text-green-600 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                    <TrendingUp className="w-2.5 h-2.5" /> +2.5%
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400 italic">No recent activities found.</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" /> Security Alerts
                    </h3>
                    <div className="space-y-4 text-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-slate-100 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">All systems operational. No alerts detected.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
