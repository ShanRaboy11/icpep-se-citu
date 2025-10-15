"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LoadingScreen({ showEntrance = true }: { showEntrance?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Animation - Falls from top on first load, just rotates on route changes */}
        <motion.div
          initial={showEntrance ? { 
            y: -300, 
            opacity: 0,
            scale: 0.5,
            rotateY: -180
          } : {
            opacity: 1,
            scale: 1,
            y: 0
          }}
          animate={{ 
            y: 0, 
            opacity: 1,
            scale: 1,
            rotateY: [0, 360]
          }}
          transition={{ 
            y: showEntrance ? { 
              type: "spring", 
              stiffness: 100, 
              damping: 12,
              duration: 1
            } : { duration: 0 },
            opacity: showEntrance ? { duration: 0.6 } : { duration: 0.3 },
            scale: showEntrance ? { 
              type: "spring", 
              stiffness: 200, 
              damping: 15 
            } : { duration: 0 },
            rotateY: { 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              delay: showEntrance ? 0.8 : 0
            }
          }}
          className="relative w-32 h-32"
          style={{ 
            transformStyle: "preserve-3d",
            perspective: 1000
          }}
        >
          <Image
            src="/icpep logo.png"
            alt="ICpEP Logo"
            fill
            className="object-contain"
            priority
            style={{ backfaceVisibility: "visible" }}
          />
        </motion.div>

        {/* Loading Text with subtle pulse */}
        <motion.p
          initial={{ opacity: 0, y: showEntrance ? 10 : 0 }}
          animate={{ 
            opacity: [0.6, 1, 0.6],
            y: 0
          }}
          transition={{ 
            opacity: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            },
            y: { duration: showEntrance ? 0.5 : 0, delay: showEntrance ? 0.8 : 0 }
          }}
          className="font-raleway text-gray-600 text-lg font-medium"
        >
          Loading...
        </motion.p>

        {/* Optional: Cute bouncing dots */}
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
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-primary3 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}