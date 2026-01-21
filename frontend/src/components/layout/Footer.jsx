import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { socialsAPI } from '../../services/api';
import { socialIconMap } from '../../components/icons/SocialIcons';

const Footer = () => {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    try {
      const response = await socialsAPI.getAll({ visible: true });
      setSocials(response.data.data);
    } catch (error) {
      console.error('Error fetching socials:', error);
    }
  };

  const getSocialIcon = (platform) => {
    const IconComponent = socialIconMap[platform.toLowerCase()];
    return IconComponent || socialIconMap.github;
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative glass mt-20 border-t border-[rgb(var(--border))]/30">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        {/* Added: text-center for mobile, sm:grid-cols-2 for tablets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500 bg-clip-text text-transparent mb-4 inline-block">
              Portfolio
            </h3>
            <p className="text-[rgb(var(--text-secondary))] mb-4 max-w-sm mx-auto md:mx-0">
              Building amazing web experiences with modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[rgb(var(--text-primary))] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Work', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-[rgb(var(--text-primary))] mb-4">
              Connect
            </h4>
            {/* Added: justify-center for mobile */}
            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              {socials.map((social) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <motion.a
                    key={social._id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-3 glass rounded-lg hover:bg-[rgb(var(--accent))]/20 transition-all text-[rgb(var(--text-primary))]"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[rgb(var(--border))] mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-[rgb(var(--text-secondary))] text-sm">
            © {currentYear} Portfolio. All rights reserved.
          </p>
          
          {/* Optional: You can add Privacy Policy / Terms links here later */}
          <div className="flex gap-6 text-sm text-[rgb(var(--text-secondary))]">
            <Link to="/privacy" className="hover:text-[rgb(var(--accent))]">Privacy</Link>
            <Link to="/terms" className="hover:text-[rgb(var(--accent))]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;