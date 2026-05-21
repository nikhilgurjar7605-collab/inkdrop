import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100) || 0;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="h-[3px] w-full bg-background-elevated rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="text-xs text-text-secondary font-medium">
        {current} of {total} chapters read
      </div>
    </div>
  );
}
