import './Auth.css'

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 14h16l-1.4-4.2A2 2 0 0 0 16.7 8H7.3a2 2 0 0 0-1.9 1.8L4 14Zm0 0v4h2v-2h12v2h2v-4M7 18a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm10 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 3 7 3v5c0 4.7-2.8 8.6-7 10-4.2-1.4-7-5.3-7-10V6l7-3Zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FlashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" fill="currentColor" />
    </svg>
  )
}

export default function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero__overlay" />
        <div className="auth-hero__content">
          <div className="auth-logo">
            <CarIcon />
            <span>AutoWash Pro</span>
          </div>

          <h1>Cham soc xe chuyen nghiep, chuan xac.</h1>
          <p>
            He thong quan ly dich vu rua xe hien dai bat danh cho nhung chu xe yeu cau su hoan my va tin
            cay tuyet doi.
          </p>

          <div className="auth-hero__chips">
            <article className="auth-chip">
              <div className="auth-chip__icon">
                <ShieldIcon />
              </div>
              <div>
                <h3>Tin cay</h3>
                <span>Bao mat thong tin</span>
              </div>
            </article>
            <article className="auth-chip">
              <div className="auth-chip__icon">
                <FlashIcon />
              </div>
              <div>
                <h3>Nhanh chong</h3>
                <span>Quy trinh toi uu</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel__container">{children}</div>
        <p className="auth-copyright">© 2024 AutoWash Pro. Precision Automotive Care.</p>
      </section>
    </main>
  )
}
