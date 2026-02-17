import Link from 'next/link';

export default function Hero() {
  return (
    <section className="max-w-4xl w-full text-center mb-20 pt-10">
      <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
        Hi, I'm Raghavendra.
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        A Computer Science student at BITS Pilani and Scaler School of Technology. 
        I build scalable backend systems, solve complex DSA problems, and explore AI engineering.
      </p>
      
      <div className="flex gap-4 justify-center">
        <Link 
          href="/projects" 
          className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          View Projects
        </Link>
        <a 
          href="https://github.com/raghavendra1729-cell" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}   