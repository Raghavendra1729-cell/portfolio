export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-gray-50 py-8 text-center text-sm text-gray-500">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {2026} Raghavendra. All rights reserved.</p>
        
        <div className="flex gap-6">
          <a href="https://github.com/yourusername" target="_blank" className="hover:text-black transition">
            GitHub
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" className="hover:text-blue-600 transition">
            LinkedIn
          </a>
          <a href="mailto:your@email.com" className="hover:text-black transition">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}