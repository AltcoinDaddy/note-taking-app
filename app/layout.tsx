import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Secret Notes App',
  description: 'A secure note-taking app using Secret Network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Secret Notes</h1>
        </header>
        <main className="container mx-auto mt-8 p-4">
          {children}
        </main>
      </body>
    </html>
  )
}