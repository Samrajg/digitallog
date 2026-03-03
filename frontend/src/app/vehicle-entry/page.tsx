"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Truck, Hash, Package, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { entryApi } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const vehicleSchema = z.object({
    driver_name: z.string().min(2, "Driver name is required"),
    vehicle_number: z.string().min(5, "Valid vehicle number is required"),
    vehicle_type: z.string().min(2, "Vehicle type is required"),
    purpose: z.string().min(5, "Purpose/Load details are required"),
    watchman_pin: z.string().length(4, "4-digit PIN required"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function VehicleEntryPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
    });

    const onSubmit = async (data: VehicleFormValues) => {
        setIsSubmitting(true);
        try {
            console.log("Submitting vehicle entry:", data);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setIsSuccess(true);
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-slate-700"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Gate Entry Authorized</h2>
                    <p className="text-slate-400 mb-6">The vehicle entry has been recorded and authorized. Proceed safely.</p>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20"
                    >
                        New Registration
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-200">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-900/20 mb-4">
                        <Truck className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Vehicle Entry</h1>
                    <p className="mt-2 text-slate-400">Record vehicle movement and cargo details</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <User className="w-4 h-4 text-emerald-500" /> Driver Name
                                </label>
                                <input
                                    {...register("driver_name")}
                                    className={cn(
                                        "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white",
                                        errors.driver_name && "border-red-500 focus:ring-red-500"
                                    )}
                                    placeholder="Driver Full Name"
                                />
                                {errors.driver_name && <p className="text-xs text-red-500 mt-1">{errors.driver_name.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-emerald-500" /> Vehicle No.
                                    </label>
                                    <input
                                        {...register("vehicle_number")}
                                        className={cn(
                                            "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white",
                                            errors.vehicle_number && "border-red-500 focus:ring-red-500"
                                        )}
                                        placeholder="MH-01-AB-1234"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-emerald-500" /> Type
                                    </label>
                                    <select
                                        {...register("vehicle_type")}
                                        className={cn(
                                            "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white appearance-none",
                                            errors.vehicle_type && "border-red-500 focus:ring-red-500"
                                        )}
                                    >
                                        <option value="">Select</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Mini Van">Mini Van</option>
                                        <option value="Car">Car</option>
                                        <option value="Bike">Bike</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-emerald-500" /> Purpose / Load Details
                                </label>
                                <textarea
                                    {...register("purpose")}
                                    className={cn(
                                        "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all min-h-[80px] resize-none text-white",
                                        errors.purpose && "border-red-500 focus:ring-red-500"
                                    )}
                                    placeholder="Details of delivery or purpose..."
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                                        <ShieldCheck className="w-3 h-3 text-emerald-500" /> Watchman Authorization
                                    </label>
                                    <input
                                        {...register("watchman_pin")}
                                        type="password"
                                        maxLength={4}
                                        inputMode="numeric"
                                        className={cn(
                                            "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-[1em] text-white",
                                            errors.watchman_pin && "border-red-500 focus:ring-red-500"
                                        )}
                                        placeholder="****"
                                    />
                                    {errors.watchman_pin && <p className="text-xs text-red-500 mt-2 text-center">{errors.watchman_pin.message}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider",
                                isSubmitting && "animate-pulse"
                            )}
                        >
                            {isSubmitting ? "Verifying..." : "Authorize Entry"}
                        </button>
                    </form>
                </motion.div>

                <p className="text-center text-slate-600 text-sm">
                    Secure Gate Management System
                </p>
            </div>
        </div>
    );
}
