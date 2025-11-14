'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { Card } from '@/components/ui/Card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <div className="space-y-4 text-lg">
              <p>
                <strong>KidTeach</strong> is designed with privacy and safety in mind for your child.
              </p>
              <h2 className="text-2xl font-bold mt-6">What We Don&apos;t Collect</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No analytics or tracking</li>
                <li>No personal information</li>
                <li>No data sent to external servers</li>
                <li>No advertisements</li>
              </ul>
              <h2 className="text-2xl font-bold mt-6">What We Store Locally</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Family photos (stored only on your device)</li>
                <li>Content edits and preferences (stored only on your device)</li>
                <li>Language preferences (stored only on your device)</li>
              </ul>
              <h2 className="text-2xl font-bold mt-6">Your Control</h2>
              <p>
                All data is stored locally on your device using IndexedDB. You can export or delete
                your data at any time through the Settings page (Parent Mode).
              </p>
              <h2 className="text-2xl font-bold mt-6">Questions?</h2>
              <p>
                If you have any questions about privacy, please contact us through your device&apos;s
                app settings.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/">
                <button className="btn-primary">Back to Home</button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

