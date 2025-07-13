'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import WalletButton from './WalletButton'

export default function Navbar() {
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        type: "spring",
        stiffness: 200
      }
    }
  }

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/markets', label: 'Markets' },
    { href: '/markets/create', label: 'Create' },
    { href: '/my-trades', label: 'My Trades' },
    { href: '/about', label: 'About' }
  ]

  return (
    <motion.nav 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow-sm border-b sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                variants={logoVariants}
                whileHover={{ 
                  rotate: 10,
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              >
                <Image src="/castle.svg" alt="ForeCastle" width={32} height={32} />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-bold text-blue-600"
              >
                ForeCastle
              </motion.h1>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href={link.href} 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Wallet Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <WalletButton />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
