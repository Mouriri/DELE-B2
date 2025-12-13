import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <div className={styles.logo}>
            <span>Castellano con MH</span>
          </div>
          <nav className={styles.nav}>
            <Link href="#features">Características</Link>
            <Link href="#pricing">Precios</Link>
            <Link href="/admin">Admin</Link>
          </nav>
          <div>
            <a href="https://buy.stripe.com/7sY28r9re7c87f16vI1sQ01" target="_blank" className="btn btn-accent">
              Empezar Ahora
            </a>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroContent}`}>
            <div className={styles.heroText}>
              <span className={styles.badge}>
                🚀 La mejor plataforma para aprender español
              </span>
              <h1 className={styles.title}>
                Domina el Castellano con <span style={{ color: 'var(--accent)' }}>MH</span>
              </h1>
              <p className={styles.subtitle}>
                Accede a lecciones exclusivas, videos interactivos y exámenes personalizados para llevar tu español al siguiente nivel.
              </p>
              <div className={styles.actions}>
                <a href="https://buy.stripe.com/7sY28r9re7c87f16vI1sQ01" target="_blank" className="btn btn-primary">
                  Unirse al Curso
                </a>
                <Link href="#features" className="btn" style={{ border: '1px solid var(--border)' }}>
                  Saber más
                </Link>
              </div>
            </div>
            <div className={styles.heroImage}>
              <Image
                src="/hero.png"
                alt="Estudiante aprendiendo español"
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.features}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Todo lo que necesitas</h2>
              <p style={{ color: 'var(--muted)' }}>Una plataforma completa diseñada para tu aprendizaje.</p>
            </div>
            <div className={styles.featuresGrid}>
              <div className="card">
                <div className={styles.featureIcon}>📺</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Videos Exclusivos</h3>
                <p style={{ color: 'var(--muted)' }}>Cientos de horas de contenido en video explicado detalladamente.</p>
              </div>
              <div className="card">
                <div className={styles.featureIcon}>📝</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Exámenes Prácticos</h3>
                <p style={{ color: 'var(--muted)' }}>Pon a prueba tus conocimientos con exámenes interactivos.</p>
              </div>
              <div className="card">
                <div className={styles.featureIcon}>🏆</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Certificación</h3>
                <p style={{ color: 'var(--muted)' }}>Avanza niveles y demuestra tu dominio del idioma.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className={styles.pricing}>
          <div className="container">
            <div className={styles.pricingCard}>
              <div className={styles.ribbon}>
                OFERTA LIMITADA
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Acceso Premium</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Obtén acceso ilimitado a todos los recursos de la plataforma.</p>
              <div className={styles.price}>
                4.99€ <span style={{ fontSize: '1rem' }}>pago único</span>
              </div>
              <ul className={styles.list}>
                <li>✅ Acceso a todos los videos</li>
                <li>✅ Exámenes ilimitados</li>
                <li>✅ Soporte prioritario</li>
              </ul>
              <a href="https://buy.stripe.com/7sY28r9re7c87f16vI1sQ01" target="_blank" className="btn btn-primary" style={{ width: '100%' }}>
                Suscribirse Ahora
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          © {new Date().getFullYear()} Castellano con MH. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
