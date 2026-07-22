import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-white font-semibold">Knowledge Base</span>
            </div>
            <p className="text-sm leading-relaxed">
              A comprehensive knowledge base powered by Headless CMS. Dynamic content management with rich text, equations, and structured documentation.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#pages" className="hover:text-white transition-colors">All Articles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Technology</h4>
            <ul className="space-y-2 text-sm">
              {['Next.js 14', 'Redux Toolkit', 'React KaTeX', 'TailwindCSS', 'Express.js', 'MongoDB'].map((tech) => (
                <li key={tech} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-500" />
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Knowledge Base. Powered by Headless CMS.
          </p>
          <p className="text-xs">
            Built with Next.js &middot; ExpressJS &middot; MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
