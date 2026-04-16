"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  MessageCircle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react"
import { services, WHATSAPP_LINK, CALENDLY_LINK } from "@/lib/data"

export default function ServicesPage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Floating WhatsApp Button */}
      <motion.a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </motion.a>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-lg text-white hidden sm:block">Visual Digital Media</span>
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-600"
                onClick={() => window.open(CALENDLY_LINK, "_blank")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Call
              </Button>
            </div>

            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-transparent to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium mb-4">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Solutions Built for <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Your Success
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From automation to AI, we provide end-to-end digital solutions that transform how you do business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link href={`/services/${service.id}`}>
                  <Card className="bg-[#12121a] border-white/10 hover:border-pink-500/50 transition-all duration-500 h-full overflow-hidden relative cursor-pointer">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    <CardContent className="p-8 relative z-10">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features Preview */}
                      <div className="space-y-2 mb-6">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-pink-400 font-medium group-hover:text-pink-300 transition-colors">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 p-12 text-center"
          >
            <div className="absolute inset-0 bg-[#12121a]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Let&apos;s discuss which solutions are right for your business
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-lg px-8 h-14 rounded-xl"
                  onClick={() => window.open(CALENDLY_LINK, "_blank")}
                >
                  <Calendar className="mr-2 w-5 h-5" />
                  Schedule Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-lg px-8 h-14 rounded-xl text-white"
                  onClick={() => window.open(WHATSAPP_LINK, "_blank")}
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Chat on WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-gray-400">© 2024 Visual Digital Media</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <a href="mailto:info.vsualdm@gmail.com" className="hover:text-white">info.vsualdm@gmail.com</a>
              <span>|</span>
              <a href="mailto:geo@vsualdigitalmedia.com" className="hover:text-white">geo@vsualdigitalmedia.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
