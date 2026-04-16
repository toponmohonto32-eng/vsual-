"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  ArrowRight,
  Mail,
  Menu,
  X,
  Calendar,
  MessageCircle,
  Star,
  ChevronRight,
  Sparkles,
  LogIn,
  LayoutDashboard,
  Shield,
  Users,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import { services, processSteps, testimonials, stats, WHATSAPP_LINK, CALENDLY_LINK } from "@/lib/data"
import { useAuthStore } from "@/store/auth"
import { useGHLTracking, trackFormSubmission, trackCTAClick, trackBookingIntent } from "@/lib/ghl-tracking"

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  // Initialize GHL tracking
  useGHLTracking()

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contactForm, source: "Landing Page Contact Form" }),
      })
      if (res.ok) {
        // Track form submission with GHL
        trackFormSubmission("contact_form", { email: contactForm.email, name: contactForm.name })
        toast.success("Message sent! We'll get back to you soon.")
        setContactForm({ name: "", email: "", subject: "", message: "" })
      }
    } catch (error) {
      trackFormSubmission("contact_form", { email: contactForm.email, name: contactForm.name })
      toast.success("Message sent! We'll get back to you soon.")
      setContactForm({ name: "", email: "", subject: "", message: "" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Floating WhatsApp Button */}
      <motion.a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </motion.a>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="VSUAL Logo" className="w-10 h-10 rounded-lg object-contain" />
              <span className="font-bold text-lg text-white hidden sm:block">VSUAL</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Services</a>
              <a href="#process" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Process</a>
              <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Testimonials</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Contact</a>

              {user ? (
                <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                    onClick={() => router.push("/admin")}
                  >
                    <Shield className="w-4 h-4 mr-2 text-pink-400" />
                    Admin
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                    onClick={() => router.push("/team")}
                  >
                    <Users className="w-4 h-4 mr-2 text-purple-400" />
                    Team
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                    onClick={() => router.push("/client")}
                  >
                    <Briefcase className="w-4 h-4 mr-2 text-cyan-400" />
                    Client
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => window.open(WHATSAPP_LINK, "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2 text-green-400" />
                Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => window.open(CALENDLY_LINK, "_blank")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Call
              </Button>

              {user ? (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={() => router.push("/admin")}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  My Portal
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={() => router.push("/login")}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>

            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden bg-[#0d0d12] border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-2">
              <a href="#services" className="block text-gray-300 py-2 px-3 rounded-lg hover:bg-white/5">Services</a>
              <a href="#process" className="block text-gray-300 py-2 px-3 rounded-lg hover:bg-white/5">Process</a>
              <a href="#testimonials" className="block text-gray-300 py-2 px-3 rounded-lg hover:bg-white/5">Testimonials</a>
              <a href="#contact" className="block text-gray-300 py-2 px-3 rounded-lg hover:bg-white/5">Contact</a>

              <div className="pt-3 space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white"
                  onClick={() => window.open(CALENDLY_LINK, "_blank")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Call
                </Button>

                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                  onClick={() => { router.push("/login"); setMobileMenuOpen(false); }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-transparent to-purple-500/5" />
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
            style={{ background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)", left: "-10%", top: "10%" }}
            animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
            style={{ background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)", right: "-5%", bottom: "20%" }}
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Digital Excellence Delivered
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Business Growth
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              We build intelligent automation systems, stunning websites, and growth engines
              that accelerate your business to the next level.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => {
                  trackBookingIntent("hero_cta")
                  window.open(CALENDLY_LINK, "_blank")
                }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 h-14 rounded-xl shadow-lg shadow-pink-500/25"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Book Free Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-lg px-8 h-14 rounded-xl text-white"
                onClick={() => router.push("/services")}
              >
                Explore Services
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            {/* Portal Access CTA */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              {user ? (
                <>
                  <span className="text-gray-500 text-sm">Access your portal:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                    onClick={() => router.push("/admin")}
                  >
                    <Shield className="w-4 h-4 mr-1" /> Admin
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    onClick={() => router.push("/team")}
                  >
                    <Users className="w-4 h-4 mr-1" /> Team
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    onClick={() => router.push("/client")}
                  >
                    <Briefcase className="w-4 h-4 mr-1" /> Client
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-gray-500 text-sm">Already a client?</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                    onClick={() => router.push("/login")}
                  >
                    <LogIn className="w-4 h-4 mr-1" /> Login to Portal
                  </Button>
                </>
              )}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 rounded-2xl bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.05, borderColor: "rgba(236, 72, 153, 0.3)" }}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section - 3D Cards */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium mb-4">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Solutions That <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Drive Results</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Comprehensive digital solutions designed to accelerate your business growth
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.slice(0, 8).map((service, index) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -10, rotateY: 5, rotateX: 5 }}
                style={{ perspective: 1000 }}
              >
                <Link href={`/services/${service.id}`}>
                  <Card className="bg-[#12121a] border-white/10 hover:border-pink-500/50 transition-all duration-500 h-full group overflow-hidden relative cursor-pointer">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <CardContent className="p-6 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <service.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-pink-300 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center text-pink-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 hover:bg-white/10 text-white px-8"
              onClick={() => router.push("/services")}
            >
              View All Services
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Work Process Section */}
      <section id="process" className="py-24 relative bg-gradient-to-b from-[#0d0d12] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              How We <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Work</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A streamlined approach to deliver exceptional results
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500/20 via-purple-500/40 to-pink-500/20 -translate-y-1/2" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <motion.div
                    className="bg-[#12121a] border border-white/10 rounded-3xl p-8 text-center relative z-10 hover:border-pink-500/30 transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    {/* Step Number */}
                    <motion.div
                      className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30"
                      whileHover={{ scale: 1.2 }}
                    >
                      {step.step}
                    </motion.div>

                    <div className="text-5xl mb-4 mt-4">{step.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Client <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Success Stories</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-[#12121a] border-white/10 h-full hover:border-cyan-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-white/10 p-8 sm:p-12 text-center"
          >
            <div className="absolute inset-0 bg-[#12121a]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Accelerate Your Growth?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Schedule a free consultation and discover how we can transform your business
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 h-14 rounded-xl"
                  onClick={() => {
                    trackBookingIntent("cta_section")
                    window.open(CALENDLY_LINK, "_blank")
                  }}
                >
                  <Calendar className="mr-2 w-5 h-5" />
                  Book Free Call
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

      {/* Contact Section */}
      <section id="contact" className="py-24 relative bg-[#0d0d12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium mb-4">
                Contact Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Let&apos;s Start Your <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Journey</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Ready to transform your business? Get in touch and let&apos;s discuss your goals.
              </p>

              <div className="space-y-6">
                <motion.a
                  href="mailto:info.vsualdm@gmail.com"
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                    <Mail className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Us</p>
                    <p>info.vsualdm@gmail.com</p>
                  </div>
                </motion.a>

                <motion.a
                  href="mailto:geo@vsualdigitalmedia.com"
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Inquiries</p>
                    <p>geo@vsualdigitalmedia.com</p>
                  </div>
                </motion.a>

                <motion.a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p>Join our group chat</p>
                  </div>
                </motion.a>

                <motion.a
                  href={CALENDLY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Book a Meeting</p>
                    <p>30-minute free consultation</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#12121a] border-white/10">
                <CardContent className="p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
                        <Input
                          placeholder="John Doe"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="bg-white/5 border-white/10 text-white h-12"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                        <Input
                          type="email"
                          placeholder="john@company.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="bg-white/5 border-white/10 text-white h-12"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Subject</label>
                      <Input
                        placeholder="How can we help?"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="bg-white/5 border-white/10 text-white h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Message</label>
                      <Textarea
                        placeholder="Tell us about your project..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="bg-white/5 border-white/10 text-white min-h-[120px]"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-12"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="VSUAL Logo" className="w-8 h-8 rounded-lg object-contain" />
              <span className="text-gray-400">© 2024 VSUAL</span>
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
