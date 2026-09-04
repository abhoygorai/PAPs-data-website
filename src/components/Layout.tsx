import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app-shell">
      <div className="bg-glow" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <header className="site-header">
        <div className="brand-block">
          <p className="brand-mark">PAP Employment</p>
          <p className="brand-tagline">Live records of file status</p>
        </div>

        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/" end className={navClass}>
            Approved
          </NavLink>
          <NavLink to="/under-process" className={navClass}>
            Under process
          </NavLink>
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p className="footer-credit">
          Created by{" "}
          <a
            className="footer-link"
            href="https://www.linkedin.com/in/abhoygorai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abhoy Gorai
          </a>
        </p>
      </footer>
    </div>
  );
}

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "nav-link is-active" : "nav-link";
}
