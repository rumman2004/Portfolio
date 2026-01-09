import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
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

  // FIXED: Get social icon component
  const getSocialIcon = (platform) => {
    const IconComponent = socialIconMap[platform.toLowerCase()];
    return IconComponent || socialIconMap.github; // Fallback to github icon
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative glass mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500 bg-clip-text text-transparent mb-4">
              Portfolio
            </h3>
            <p className="text-[rgb(var(--text-secondary))] mb-4">
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
                    className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links - FIXED */}
          <div>
            <h4 className="font-semibold text-[rgb(var(--text-primary))] mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socials.map((social) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <motion.a
                    key={social._id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-3 glass rounded-lg hover:bg-[rgb(var(--accent))]/20 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[rgb(var(--border))] mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[rgb(var(--text-secondary))] text-sm">
            © {currentYear} Portfolio. All rights reserved.
          </p>
          <p className="text-[rgb(var(--text-secondary))] text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> using React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
