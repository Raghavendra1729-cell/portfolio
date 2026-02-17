"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-3xl opacity-60" />

      <div className="container px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
            Available for Internships
          </span>
          
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Hi, I'm <span className="text-blue-600">Raghavendra</span>.
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8 leading-relaxed">
            A Computer Science student at <span className="font-semibold text-black">BITS Pilani</span> & <span className="font-semibold text-black">Scaler</span>.
            I engineer scalable backends, solve complex algorithms, and build AI-driven solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="#projects" 
              className="px-8 py-3.5 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View My Work <ArrowRight className="w-4 h-4" />
            </Link>
            
            <div className="flex gap-4">
              <SocialBtn href="https://github.com/raghavendra1729-cell" icon={<Github className="w-5 h-5" />} />
              <SocialBtn href="https://linkedin.com" icon={<Linkedin className="w-5 h-5" />} />
              <SocialBtn href="mailto:your.email@example.com" icon={<Mail className="w-5 h-5" />} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SocialBtn({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-3.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition shadow-sm"
    >
      {icon}
    </a>
  );
}