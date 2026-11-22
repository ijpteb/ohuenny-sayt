import { STUDIO_NAME } from '../content'
import { scrollToEl } from '../lib/smooth'

export default function Header() {
  return (
    <header className="header">
      <a className="logo" href="#top" onClick={(e) => (e.preventDefault(), scrollToEl('#top'))}>
        <span className="logo__mark" aria-hidden>
          ●
        </span>
        {STUDIO_NAME}
      </a>
      <nav className="header__nav">
        <button className="pill" onClick={() => scrollToEl('#work')}>
          Работы
        </button>
        <button className="pill pill--solid" onClick={() => scrollToEl('#contact')}>
          Связаться
        </button>
      </nav>
    </header>
  )
}
