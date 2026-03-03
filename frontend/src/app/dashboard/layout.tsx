"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    Truck,
    QrCode,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", roles: ["admin", "watchman"] },
    { name: "Visitor Log", icon: Users, href: "/dashboard/visitors", roles: ["admin", "watchman"] },
    { name: "Vehicle Log", icon: Truck, href: "/dashboard/vehicles", roles: ["admin", "watchman"] },
    { name: "QR Management", icon: QrCode, href: "/dashboard/qr", roles: ["admin"] },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userRole, setUserRole] = useState("admin"); // Simulated role: "admin" or "watchman"
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed inset-y-0 z-50",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
                        <QrCode className="text-white w-6 h-6" />
                    </div>
                    {isSidebarOpen && (
                        <span className="font-bold text-slate-900 text-xl tracking-tight truncate">Digital Log</span>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.filter(item => item.roles.includes(userRole)).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all group",
                                pathname === item.href
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5",
                                pathname === item.href ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-900"
                            )} />
                            {isSidebarOpen && (
                                <span className="font-medium truncate">{item.name}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className={cn(
                        "flex items-center gap-3 p-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl cursor-pointer transition-all",
                        !isSidebarOpen && "justify-center"
                    )}>
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-medium">Sign Out</span>}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={cn(
                    "flex-1 transition-all duration-300",
                    isSidebarOpen ? "ml-64" : "ml-20"
                )}
            >
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {menuItems.find(item => item.href === pathname)?.name || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                            <div className="text-right flex flex-col hidden md:flex">
                                <span className="text-sm font-bold text-slate-900">Admin User</span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setUserRole("admin")}
                                        className={cn("text-[10px] px-1.5 py-0.5 rounded border transition-all", userRole === 'admin' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 border-slate-200 text-slate-500")}
                                    >
                                        Admin
                                    </button>
                                    <button
                                        onClick={() => setUserRole("watchman")}
                                        className={cn("text-[10px] px-1.5 py-0.5 rounded border transition-all", userRole === 'watchman' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 border-slate-200 text-slate-500")}
                                    >
                                        Watchman
                                    </button>
                                </div>
                            </div>
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
