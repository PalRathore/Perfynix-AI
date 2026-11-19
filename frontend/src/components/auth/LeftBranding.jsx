import { motion } from "framer-motion";
import {
  ShieldCheck,
  Gauge,
  Sparkles,
  BrainCircuit,
  Lock,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import BrandLogo from "../common/BrandLogo";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Security Analysis",
    desc: "Vulnerability detection & threat assessment.",
    accent: "from-brand-500 to-brand-600",
    delay: 0.15,
  },
  {
    icon: Gauge,
    title: "Performance Analytics",
    desc: "Speed, health & load-time metrics.",
    accent: "from-cyan-500 to-blue-600",
    delay: 0.25,
  },
  {
    icon: BrainCircuit,
    title: "AI Recommendations",
    desc: "Intelligent, prioritized remediation.",
    accent: "from-emerald-500 to-teal-600",
    delay: 0.35,
  },
  {
    icon: Sparkles,
    title: "Explainable AI",
    desc: "Transparent risk scoring & reasoning.",
    accent: "from-indigo-500 to-accent-600",
    delay: 0.45,
  },
];

const CHIPS = [
  "Security Scans",
  "Performance Audit",
  "AI Remediation",
  "Risk Intelligence",
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function LeftBranding() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col justify-center px-8 xl:px-14 py-10"
    >
      {/* Brand Header */}
      <motion.div variants={item} className="mb-6 flex items-center">
        <BrandLogo size={46} titleClassName="text-xl sm:text-[23px]" subtitleClassName="text-[10px] sm:text-[11.5px]" showText={true} />
      </motion.div>

      {/* Main Hero Heading */}
      <motion.h1
        variants={item}
        className="text-4xl lg:text-[46px] xl:text-[52px] font-bold leading-[1.05] tracking-[-0.035em] text-slate-900 dark:text-white"
      >
        <span className="bg-gradient-to-r from-brand-600 via-cyan-500 to-accent-600 bg-clip-text text-transparent">
          AI-Powered
        </span>{" "}
        Website &amp; Web App
        <br />
        Security &amp; Performance
        <br />
        Assessment Platform
      </motion.h1>

      {/* Description Subtitle */}
      <motion.p
        variants={item}
        className="mt-4.5 max-w-[460px] text-base leading-[1.55] font-normal text-slate-600 dark:text-slate-300"
      >
        Unified web application security scans, performance metrics, and automated AI risk insights.
      </motion.p>

      {/* Feature Cards Grid */}
      <motion.div variants={item} className="mt-8 grid grid-cols-2 gap-3.5">
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: feature.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -3,
              scale: 1.01,
            }}
            className={`
              group rounded-2xl p-4 transition-all duration-300 backdrop-blur-xl border
              ${
                isDark
                  ? "bg-slate-900/60 border-slate-800/80 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)] hover:border-slate-700"
                  : "bg-white/80 border-white/90 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.08)] hover:border-brand-200"
              }
            `}
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} text-white shadow-sm`}
            >
              <feature.icon size={20} />
            </div>

            <h3 className="mb-1 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              {feature.title}
            </h3>

            <p className="text-xs sm:text-[13px] leading-[1.55] text-slate-600 dark:text-slate-300 font-normal">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tech Chips */}
      <motion.div variants={item} className="mt-7 flex flex-wrap gap-2">
        {CHIPS.map((chip) => (
          <span
            key={chip}
            className={`
              rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all duration-200 cursor-default
              ${
                isDark
                  ? "bg-slate-900/70 border border-slate-700/80 text-slate-200 shadow-sm"
                  : "bg-white/85 border border-slate-200/90 text-slate-700 shadow-xs"
              }
            `}
          >
            {chip}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
