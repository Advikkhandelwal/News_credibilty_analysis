import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, BrainCircuit, Activity } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center px-6 relative"
    >
      <div className="max-w-3xl z-10 relative">
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
            System Live
          </span>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-zinc-900"
        >
          Verify the Truth. <br className="hidden md:block" />
          Detect Misinformation.
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg text-zinc-500 mb-12 max-w-xl mx-auto leading-relaxed"
        >
          A dual-phase credibility engine combining Machine Learning classification with Large Language Model reasoning.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <Link
            to="/analyze"
            className="group flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 w-full sm:w-auto"
          >
            Start Analyzing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/history"
            className="flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium px-6 py-3 rounded-lg transition-all duration-200 w-full sm:w-auto"
          >
            View History
          </Link>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        className="grid md:grid-cols-3 gap-6 max-w-5xl w-full z-10"
      >
        <FeatureCard
          icon={<BrainCircuit className="w-6 h-6 text-zinc-700" />}
          title="ML Classifier"
          description="Evaluates textual features using TF-IDF against trained models to identify patterns of misinformation."
        />
        <FeatureCard
          icon={<ShieldCheck className="w-6 h-6 text-zinc-700" />}
          title="Agentic Reasoning"
          description="Leverages advanced LLMs to fact-check claims and structure a readable, evidence-based report."
        />
        <FeatureCard
          icon={<Activity className="w-6 h-6 text-zinc-700" />}
          title="Explainability"
          description="Transparent metrics including confidence scores, keyword extraction, and risk factor breakdowns."
        />
      </motion.div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      className="bg-white border border-zinc-200 p-8 rounded-xl text-left hover-shadow transition-shadow duration-300"
    >
      <div className="bg-zinc-50 border border-zinc-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-zinc-900">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}