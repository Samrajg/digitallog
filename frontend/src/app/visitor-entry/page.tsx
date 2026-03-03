"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, Briefcase, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { entryApi } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const visitorSchema = z.object({
    full_name: z.string().min(2, "Full name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    purpose: z.string().min(5, "Purpose of visit is required"),
    person_to_meet: z.string().min(2, "Person to meet is required"),
});

type VisitorFormValues = z.infer<typeof visitorSchema>;

export default function VisitorEntryPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VisitorFormValues>({
        resolver: zodResolver(visitorSchema),
    });

    const onSubmit = async (data: VisitorFormValues) => {
        setIsSubmitting(true);
        try {
            // Mock API call - will connect to FastAPI later
            console.log("Submitting visitor entry:", data);
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Check-in Successful!</h2>
                    <p className="text-slate-600 mb-6">Your entry has been recorded. Please wait for further instructions at the reception.</p>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        New Registration
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4">
                        <UserPlus className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Visitor Registration</h1>
                    <p className="mt-2 text-slate-600">Please fill in your details to enter the facility</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" /> Full Name
                            </label>
                            <input
                                {...register("full_name")}
                                className={cn(
                                    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all",
                                    errors.full_name && "border-red-500 focus:ring-red-500"
                                )}
                                placeholder="John Doe"
                            />
                            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" /> Phone Number
                            </label>
                            <input
                                {...register("phone")}
                                className={cn(
                                    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all",
                                    errors.phone && "border-red-500 focus:ring-red-500"
                                )}
                                placeholder="+91 9876543210"
                            />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-slate-400" /> Purpose of Visit
                            </label>
                            <textarea
                                {...register("purpose")}
                                className={cn(
                                    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[100px] resize-none",
                                    errors.purpose && "border-red-500 focus:ring-red-500"
                                )}
                                placeholder="Business meeting, delivery, maintenance..."
                            />
                            {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-slate-400" /> Person/Department to Meet
                            </label>
                            <input
                                {...register("person_to_meet")}
                                className={cn(
                                    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all",
                                    errors.person_to_meet && "border-red-500 focus:ring-red-500"
                                )}
                                placeholder="Manager / IT Department"
                            />
                            {errors.person_to_meet && <p className="text-xs text-red-500 mt-1">{errors.person_to_meet.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed",
                                isSubmitting && "animate-pulse"
                            )}
                        >
                            {isSubmitting ? "Submitting..." : "Check In"}
                        </button>
                    </form>
                </motion.div>

                <p className="text-center text-slate-400 text-sm">
                    Powered by Digital Log
                </p>
            </div>
        </div>
    );
}
