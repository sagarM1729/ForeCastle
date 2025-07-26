'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// Market Categories Component
export default function MarketCategories() {
  const categories = [
    { 
      name: 'Politics', 
      icon: '🏛️', 
      count: 42, 
      gradient: 'from-red-500 to-pink-500',
      description: 'Elections & Policy'
    },
    { 
      name: 'Sports', 
      icon: '⚽', 
      count: 28, 
      gradient: 'from-green-500 to-emerald-500',
      description: 'Games & Championships'
    },
    { 
      name: 'Crypto', 
      icon: '₿', 
      count: 35, 
      gradient: 'from-orange-500 to-yellow-500',
      description: 'Digital Assets'
    },
    { 
      name: 'Technology', 
      icon: '💻', 
      count: 19, 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Innovation & AI'
    },
    { 
      name: 'Finance', 
      icon: '📈', 
      count: 23, 
      gradient: 'from-purple-500 to-indigo-500',
      description: 'Markets & Economy'
    },
    { 
      name: 'Entertainment', 
      icon: '🎬', 
      count: 15, 
      gradient: 'from-pink-500 to-rose-500',
      description: 'Movies & Culture'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <div className="container mx-auto px-6">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 rounded-full text-sm font-semibold mb-4">
          📂 Categories
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Explore by Category
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover markets across different topics and find the predictions that interest you most.
        </p>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              y: -8,
              transition: { duration: 0.3 }
            }}
            className="group"
          >
            <Link href={`/markets?category=${category.name.toLowerCase()}`}>
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 p-6 border border-gray-700/50 hover:border-gray-600/70 h-full text-center">
                
                {/* Icon */}
                <motion.div
                  className="text-4xl mb-4"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.4 }
                  }}
                >
                  {category.icon}
                </motion.div>
                
                {/* Category Badge */}
                <div className="mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${category.gradient}`}>
                    {category.name}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-300 mb-3 font-medium">
                  {category.description}
                </p>
                
                {/* Count */}
                <div className="flex items-center justify-center space-x-1 text-gray-400">
                  <span className="text-xs">📊</span>
                  <span className="text-sm font-medium">{category.count} markets</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/markets"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-orange-500/25 transition-all duration-300"
          >
            <span className="text-xl">🔍</span>
            <span>View All Markets</span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
