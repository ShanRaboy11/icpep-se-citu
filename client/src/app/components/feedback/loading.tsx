"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative w-32 h-32"
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        >
          <Image
            src="/brand/icpep-logo.avif"
            alt="ICpEP Logo"
            fill
            sizes="128px"
            className="object-contain"
            priority
            style={{ backfaceVisibility: "visible" }}
          />
        </motion.div>

        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="font-raleway text-gray-600 text-lg font-medium"
        >
          Loading...
        </motion.p>

        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ y: 0 }}
              animate={{ y: [-5, 5, -5] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
              className="w-2 h-2 bg-primary3 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoadingIndicator({
  label,
  size = "md",
  className = "",
}: {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const dot = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";
  return (
    <div
      role="status"
      aria-label={label ?? "Loading"}
      className={`flex flex-col items-center gap-3 ${className}`}
    >
      <div className="flex gap-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            className={`${dot} bg-primary3 rounded-full`}
          />
        ))}
      </div>
      {label && (
        <p className="text-sm font-raleway text-gray-500">{label}</p>
      )}
    </div>
  );
}
