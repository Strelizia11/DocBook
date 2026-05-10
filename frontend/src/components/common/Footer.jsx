import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="bg-slate-800 text-slate-300 mt-16">
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h2 className="text-white text-xl font-bold mb-3">Doc<span className="text-primary">Book</span></h2>
        <p className="text-sm leading-relaxed">Your trusted platform to find and book appointments with qualified doctors near you.</p>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-3">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
          <li><Link to="/doctors" className="hover:text-white transition-colors">Find Doctors</Link></li>
          <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
          <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-3">Contact</h3>
        <ul className="space-y-2 text-sm">
          <li>support@docbook.com</li>
          <li>+63 900 000 0000</li>
          <li>Philippines</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-700 text-center py-4 text-xs text-slate-500">
      © {new Date().getFullYear()} DocBook. All rights reserved.
    </div>
  </footer>
)

export default Footer