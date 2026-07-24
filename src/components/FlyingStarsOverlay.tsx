import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";
import { playSparkleSound, playPopSound } from "../utils/audio";

export interface FlyingStarParticle {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  delay: number;
  size: number;
}

interface FlyingStarsOverlayProps {
  activeParticles: FlyingStarParticle[];
  onParticleComplete: (id: string) => void;
}

export const FlyingStarsOverlay: React.FC<FlyingStarsOverlayProps> = ({
  activeParticles,
  onParticleComplete,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {activeParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: p.startX,
              y: p.startY,
              scale: 0.2,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              x: [
                p.startX,
                p.startX + (Math.random() * 80 - 40),
                p.targetX,
              ],
              y: [
                p.startY,
                p.startY - 60 - Math.random() * 40,
                p.targetY,
              ],
              scale: [0.3, 1.4, 0.6],
              opacity: [0, 1, 1, 0.9],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.1,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1], // smooth cubic curve
            }}
            onAnimationComplete={() => {
              playSparkleSound();
              onParticleComplete(p.id);

              // Bounce the header star badge visually
              const headerBadge = document.getElementById("header-star-count");
              if (headerBadge) {
                headerBadge.classList.add("scale-125", "bg-amber-300", "ring-4", "ring-amber-200");
                setTimeout(() => {
                  headerBadge.classList.remove("scale-125", "bg-amber-300", "ring-4", "ring-amber-200");
                }, 250);
              }
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
          >
            <div className="relative">
              <Star
                aria-hidden="true"
                style={{ width: p.size, height: p.size }}
                className="fill-amber-400 text-amber-300 stroke-[1.5]"
              />
              {/* Sparkle Glow Burst */}
              <span className="absolute inset-0 rounded-full bg-amber-400/40 blur-md animate-ping" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
