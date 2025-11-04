import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#0c0c0cff' }}>
      <Link href="/inicio">Inicio</Link> |{' '}
      <Link href="/catalogo">Catálogo</Link> |{' '}
      <Link href="/login">Login</Link> |{' '}
      <Link href="/legales">Legales</Link>
    </nav>
  )
}