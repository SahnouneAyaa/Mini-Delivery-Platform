import { motion } from "framer-motion";


function FloatingBubble({ icon: Icon, style, delay }) {
  return (
    <motion.div
      className="absolute w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg"
      style={style}
      animate={{ y: [-6, 6, -6] }}
      transition={{ duration: 3.5 + delay * 0.4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Icon size={18} className="text-white/80" />
    </motion.div>
  );
}


export default FloatingBubble