'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { UniversalWalletButtonCompact } from './UniversalWalletButton'
import { ClientOnly } from './ClientOnly'
import { useState, useEffect } from 'react'
import { useWallet } from '@/context/WalletContext'
import { CONFIG } from '@/config/constants'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { address, isConnected } = useWallet()
  
  // Check if current user is admin
  const isAdmin = isConnected && address && address.toLowerCase() === CONFIG.ADMIN_WALLET_ADDRESS.toLowerCase()
  
  const { scrollY } = useScroll()
  
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 30)
    })
    return () => unsubscribe()
  }, [scrollY])

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
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
        duration: 1,
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/markets', label: 'Markets', icon: '📊' },
    { href: '/markets/create', label: 'Create', icon: '✨' },
    { href: '/trades', label: 'My Trades', icon: '💼' },
    { href: '/about', label: 'About', icon: '❓' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin', icon: '🔧' }] : [])
  ]

  return (
    <motion.nav 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl' 
          : 'bg-transparent'
      }`}
    >
      {/* Background Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-indigo-900/20"
        animate={{
          opacity: isScrolled ? 1 : 0.3
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      ></motion.div>
      
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                variants={logoVariants}
                whileHover={{ 
                  rotate: 15,
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-2xl">🏰</span>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col"
              >
                <div className="animated-text-button" data-text="FORECASTLE">
                  FORECASTLE
                  <div className="hover-text">FORECASTLE</div>
                </div>
                <span className={`text-xs font-medium -mt-1 transition-colors duration-700 ${
                  isScrolled ? 'text-gray-400' : 'text-gray-300'
                }`}>Prediction Markets</span>
              </motion.div>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href={link.href} 
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-700 group flex items-center space-x-2 ${
                    link.label === 'Admin' 
                      ? `bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 ${
                          isScrolled 
                            ? 'text-orange-300 hover:text-orange-200 hover:bg-orange-500/30' 
                            : 'text-orange-200 hover:text-orange-100 hover:bg-orange-500/30'
                        }`
                      : isScrolled 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/60 backdrop-blur-sm' 
                        : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <span className="text-sm">{link.icon}</span>
                  <span>{link.label}</span>
                  
                  {/* Admin badge */}
                  {link.label === 'Admin' && (
                    <span className="ml-1 px-1.5 py-0.5 bg-orange-500/30 text-orange-300 text-xs rounded-md font-bold">
                      ADMIN
                    </span>
                  )}
                  
                  {/* Animated underline */}
                  <motion.div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-8 transition-all duration-300 ${
                      link.label === 'Admin' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                    }`}
                  />
                  
                  {/* Hover glow */}
                  <motion.div
                    className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${
                      link.label === 'Admin'
                        ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20'
                        : 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20'
                    }`}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Mobile Menu & Wallet */}
          <div className="flex items-center space-x-4">
            {/* Wallet Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="relative"
            >
              <ClientOnly>
                <UniversalWalletButtonCompact />
              </ClientOnly>
            </motion.div>
            
            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className={`lg:hidden p-2 rounded-xl transition-all duration-700 ${
                isScrolled 
                  ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      />
    </motion.nav>
  )
}
