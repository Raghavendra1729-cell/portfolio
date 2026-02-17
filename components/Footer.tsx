import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <p className="font-bold text-lg">Raghavendra</p>
          <p className="text-sm text-gray-500 mt-1">
            Backend Engineer & Problem Solver
          </p>
        </div>

        <div className="flex gap-6 text-sm text-gray-600">
          <a 
            href="https://github.com/raghavendra1729-cell" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-black transition"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-black transition"
          >
            LinkedIn
          </a>
          <a 
            href="mailto:your.email@example.com" 
            className="hover:text-black transition"
          >
            Email
          </a>
        </div>
      </div>

      <div className="border-t py-6 text-center text-xs text-gray-400 flex justify-center gap-4">
        <span>© {currentYear} All rights reserved.</span>
        <Link href="/admin" className="hover:text-gray-600">Admin</Link>
      </div>
    </footer>
  );
}