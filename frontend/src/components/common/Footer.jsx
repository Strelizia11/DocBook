import { Link } from 'react-router-dom'

const Footer = () => (
  <footer style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }} className="mt-16">
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-3" style={{ color: '#1E293B' }}>
          DOC<span style={{ color: '#0EA5E9' }}>.tify</span>
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
          Your trusted platform to find and book appointments with verified, licensed doctors across the Philippines.
        </p>
      </div>
      <div>
        <h3 className="font-semibold mb-3" style={{ color: '#1E293B' }}>Quick Links</h3>
        <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
          <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><Link to="/doctors" className="hover:text-primary transition-colors">Find Doctors</Link></li>
          <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
          <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-3" style={{ color: '#1E293B' }}>Contact</h3>
        <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
          <li>support@doctify.com</li>
          <li>+63 900 000 0000</li>
          <li>Philippines</li>
        </ul>
      </div>
    </div>
    <div className="text-center py-4 text-xs" style={{ borderTop: '1px solid #E2E8F0', color: '#64748B' }}>
      &copy; {new Date().getFullYear()} DOC.tify. All rights reserved.
    </div>
  </footer>
)

export default Footer