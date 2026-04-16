"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MessageCircle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react"
import { services, WHATSAPP_LINK, CALENDLY_LINK } from "@/lib/data"

export default function ServiceDetailPage() {
  const params = useParams()
  const serviceId = params.serviceId as string
  const service = services.find(s => s.id === serviceId)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Service Not Found</h1>
          <Link href="/services">
            <Button variant="outline" className="border-white/20 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const ServiceIcon = service.icon

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
              <Link href="/services">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Services
                </Button>
              </Link>
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
            className="flex flex-col items-center text-center"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}>
              <ServiceIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              {service.longDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-[#12121a] border-white/10 h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
                  <div className="space-y-4">
                    {service.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-[#12121a] border-white/10 h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Key Benefits</h2>
                  <div className="space-y-4">
                    {service.benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <Badge className={`bg-gradient-to-r ${service.color} text-white`}>
                          Result
                        </Badge>
                        <span className="text-gray-300">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
                Let&apos;s discuss how {service.title.toLowerCase()} can transform your business
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
