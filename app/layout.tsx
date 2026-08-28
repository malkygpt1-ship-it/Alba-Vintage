import './globals.css'

export const metadata = {
  title: 'Alba Vintage — Control Centre',
  description: 'Multi-channel vintage clothing inventory and automation control centre.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}