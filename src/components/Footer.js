'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const columnVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const linkVariants = {
    rest: { x: 0 },
    hover: { 
      x: 5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.footer 
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-gray-900 text-white py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <motion.h3 
              className="text-xl font-bold mb-4 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🏰
              </motion.span>
              <span>ForeCastle</span>
            </motion.h3>
            <p className="text-gray-400">
              Decentralized prediction markets for the future.
            </p>
          </motion.div>
          
          <motion.div
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              {[
                { href: '/markets', label: 'Browse Markets' },
                { href: '/markets/create', label: 'Create Market' },
                { href: '/my-trades', label: 'My Trades' }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  variants={linkVariants}
                  initial="rest"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              {[
                { href: '/about', label: 'About' },
                { href: '/docs', label: 'Documentation' },
                { href: '/help', label: 'Help Center' }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  variants={linkVariants}
                  initial="rest"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400">
              {[
                { href: 'https://twitter.com', label: 'Twitter' },
                { href: 'https://discord.com', label: 'Discord' },
                { href: 'https://github.com', label: 'GitHub' }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  variants={linkVariants}
                  initial="rest"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
        >
          <motion.p
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            &copy; 2025 ForeCastle. Built with ❤️ for the decentralized future.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
