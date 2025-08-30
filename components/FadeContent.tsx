import React from 'react';
import { motion } from 'framer-motion';

interface FadeContentProps {
  children: React.ReactNode;
  show?: boolean;
  delay?: number;
  duration?: number;
}

const FadeContent: React.FC<FadeContentProps> = ({ 
  children, 
  show = true,
  delay = 0,
  duration = 0.5
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeContent;