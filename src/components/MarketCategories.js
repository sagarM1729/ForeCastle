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
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const hoverVariants = {
    scale: 1.05,
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      className="container mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        variants={containerVariants}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            variants={cardVariants}
            whileHover={hoverVariants}
            className="group"
          >
            <Link href={`/markets?category=${category.name.toLowerCase()}`}>
              <motion.div className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100 p-6 text-center cursor-pointer h-full">
                {/* Gradient Background */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                
                {/* Icon */}
                <motion.div
                  className="text-5xl mb-4"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  {category.icon}
                </motion.div>
                
                {/* Category Name */}
                <motion.h3
                  className="font-bold text-lg mb-2 text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {category.name}
                </motion.h3>
                
                {/* Description */}
                <motion.p
                  className="text-sm text-gray-500 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  {category.description}
                </motion.p>
                
                {/* Count Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="inline-block"
                >
                  <motion.span
                    className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${category.gradient} shadow-sm`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.count} markets
                  </motion.span>
                </motion.div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${category.gradient.replace('from-', '').replace(' to-', ', ')})`,
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)',
                    zIndex: -1
                  }}
                />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
