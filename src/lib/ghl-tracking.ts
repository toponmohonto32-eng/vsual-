'use client'

import { useEffect } from 'react'

// GoHighLevel Tracking ID
const GHL_TRACKING_ID = 'tk_10e022fb5c9f4ebea7a518b61fa81171'

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function useGHLTracking() {
  useEffect(() => {
    // Track page views on route change
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: window.location.pathname,
          page_title: document.title,
        })
      }
    }

    // Initial page view
    handleRouteChange()

    return () => {
      // Cleanup if needed
    }
  }, [])
}

// Track form submissions
export function trackFormSubmission(formName: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submission', {
      form_name: formName,
      ...data,
    })
  }

  // Also track as conversion for GHL
  if (typeof window !== 'undefined') {
    // Push to dataLayer for GTM/GHL
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'form_submission',
      form_name: formName,
      ...data,
    })
  }
}

// Track CTA clicks
export function trackCTAClick(ctaName: string, destination?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      cta_name: ctaName,
      destination: destination,
    })
  }

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'cta_click',
      cta_name: ctaName,
      destination: destination,
    })
  }
}

// Track service views
export function trackServiceView(serviceName: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'service_view', {
      service_name: serviceName,
    })
  }

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'service_view',
      service_name: serviceName,
    })
  }
}

// Track booking intent
export function trackBookingIntent(source: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'booking_intent', {
      source: source,
    })
  }

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'booking_intent',
      source: source,
    })
  }
}

// Export the tracking ID for use in other components
export { GHL_TRACKING_ID }
