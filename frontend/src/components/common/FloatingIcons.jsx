import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  Shield,
  Lock,
  Globe,
  Server,
  Cpu,
  BrainCircuit,
  Sparkles,
  Activity,
} from "lucide-react";

const icons = [
  { Icon: Shield, top: "12%", left: "10%", delay: 0, size: 34, colorLight: "text-blue-500/35", colorDark: "text-cyan-400/40" },
  { Icon: Lock, top: "18%", right: "12%", delay: 1, size: 32, colorLight: "text-indigo-500/35", colorDark: "text-purple-400/40" },
  { Icon: Globe, top: "62%", left: "6%", delay: 2, size: 38, colorLight: "text-cyan-600/35", colorDark: "text-blue-400/40" },
  { Icon: Server, top: "72%", right: "16%", delay: 3, size: 34, colorLight: "text-purple-500/35", colorDark: "text-cyan-300/40" },
  { Icon: Cpu, top: "42%", right: "44%", delay: 4, size: 30, colorLight: "text-blue-600/30", colorDark: "text-indigo-400/35" },
  { Icon: BrainCircuit, top: "82%", left: "38%", delay: 5, size: 36, colorLight: "text-purple-600/35", colorDark: "text-purple-300/40" },
  { Icon: Sparkles, top: "28%", left: "52%", delay: 6, size: 26, colorLight: "text-cyan-500/35", colorDark: "text-cyan-300/40" },
  { Icon: Activity, top: "52%", right: "6%", delay: 7, size: 30, colorLight: "text-indigo-600/35", colorDark: "text-blue-300/40" },
];

export default function FloatingIcons() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {icons.map(({ Icon, delay, size, colorLight, colorDark, ...position }, index) => (
        <motion.div
          key={index}
          className={`absolute ${isDark ? colorDark : colorLight}`}
          style={position}
          animate={{
            y: [0, -16, 0],
            rotate: [-3, 3, -3],
            opacity: isDark ? [0.35, 0.75, 0.35] : [0.3, 0.65, 0.3],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 7 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          <Icon size={size} strokeWidth={1.6} />
        </motion.div>
      ))}
    </div>
  );
}
