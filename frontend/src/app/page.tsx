"use client";

import Link from "next/link";
import {
  Users,
  Truck,
  Settings,
  ShieldCheck,
  ArrowRight,
  QrCode
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 italic">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <QrCode className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter">DIGITAL LOG</span>
        </div>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-sm font-bold transition-all flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" /> Admin Portal
        </Link>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Enterprise Entry Management
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-black tracking-tight leading-[0.9]"
            >
              Digitize Your <span className="text-indigo-600">Gate Operations</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 max-w-lg leading-relaxed"
            >
              Replace paper logbooks with a secure, QR-driven visitor and vehicle tracking system. Immutable, traceable, and premium.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/visitor-entry"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
              >
                Visitor Registration <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/vehicle-entry"
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-100 flex items-center gap-2"
              >
                Vehicle Entry <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="bg-slate-50 rounded-[40px] aspect-square border border-slate-100 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
              <div className="relative h-full border-4 border-white rounded-[32px] shadow-2xl overflow-hidden bg-white">
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-slate-100 rounded-full" />
                    <div className="h-8 w-8 bg-indigo-50 rounded-lg" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 w-full bg-slate-50 rounded-xl" />
                    <div className="h-10 w-full bg-slate-50 rounded-xl" />
                    <div className="h-32 w-full bg-slate-50 rounded-xl" />
                  </div>
                  <div className="h-14 w-full bg-indigo-600 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Floating UI elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="bg-green-100 p-2 rounded-lg">
                <ShieldCheck className="text-green-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry Status</p>
                <p className="text-sm font-bold text-slate-900">Verified & Secure</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Visitors</p>
                <p className="text-sm font-bold text-slate-900">12 Active Now</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">© 2026 Digital Log Management System. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
