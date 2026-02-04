'use client'

import { motion } from 'framer-motion'

export default function ProductSkeleton() {
    return (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 flex gap-3 w-full max-w-sm">
            {/* Image Skeleton */}
            <div className="w-24 h-24 bg-[#0F0F0F] rounded-lg shrink-0 relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent"
                    animate={{
                        x: ['-100%', '200%']
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#0F0F0F] rounded w-3/4 overflow-hidden relative">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent"
                        animate={{
                            x: ['-100%', '100%']
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>
                <div className="h-3 bg-[#0F0F0F] rounded w-full overflow-hidden relative">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent"
                        animate={{
                            x: ['-100%', '100%']
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 0.2
                        }}
                    />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-[#0F0F0F] rounded w-16 overflow-hidden relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent"
                            animate={{
                                x: ['-100%', '100%']
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 0.4
                            }}
                        />
                    </div>
                    <div className="h-8 bg-[#0F0F0F] rounded-md w-20 overflow-hidden relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent"
                            animate={{
                                x: ['-100%', '100%']
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 0.5
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
