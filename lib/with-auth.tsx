'use client'

import React from "react"

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * HOC for protecting pages that require authentication
 * Redirects to /login if user is not authenticated
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthComponent(props: P) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      // Only redirect if we've finished loading and there's no user
      if (!isLoading && !user) {
        router.push('/login')
      }
    }, [user, isLoading, router])

    // Show loading state while checking auth
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    // Don't render component until we confirm user is authenticated
    if (!user) {
      return null
    }

    return <Component {...props} />
  }
}
