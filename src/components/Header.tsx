"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Download, HeartHandshake, Menu, X } from "lucide-react";
import { TrackedDonationLink } from "@/components/TrackedDonationLink";
import { navigation, siteConfig } from "@/content/site-config";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const navLinks = (
    <>
      {navigation
        .filter((item) => item.href !== "/donaciones")
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
    </>
  );

  return (
    <header className="site-header" ref={panelRef}>
      <Link className="brand" href="/" aria-label={`${siteConfig.appName} inicio`}>
        <span className="brand-mark">
          <img src={siteConfig.logo} alt="" aria-hidden />
        </span>
        <span>{siteConfig.appName}</span>
      </Link>
      <nav className="desktop-nav" aria-label="Navegación principal">
        {navLinks}
      </nav>
      <div className="header-actions">
        <TrackedDonationLink className="header-donate" href="/donaciones">
          <HeartHandshake size={16} aria-hidden /> Donar
        </TrackedDonationLink>
        <Link className="header-cta" href="/descargar">
          <Download size={16} aria-hidden /> Descargar
        </Link>
      </div>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </button>
      {open ? (
        <nav className="mobile-nav" aria-label="Navegación móvil">
          {navLinks}
          <TrackedDonationLink className="mobile-donate" href="/donaciones" onClick={() => setOpen(false)}>
            <HeartHandshake size={16} aria-hidden /> Donar
          </TrackedDonationLink>
          <Link className="mobile-cta" href="/descargar" onClick={() => setOpen(false)}>
            <Download size={16} aria-hidden /> Descargar
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
