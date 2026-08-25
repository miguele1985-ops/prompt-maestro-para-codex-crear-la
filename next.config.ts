import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypalobjects.com"
  : "script-src 'self' 'unsafe-inline' https://www.paypalobjects.com";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://www.paypalobjects.com; font-src 'self'; connect-src 'self' https://www.paypal.com https://www.paypalobjects.com; media-src 'self'; frame-src https://www.youtube.com https://player.vimeo.com https://www.paypal.com; base-uri 'self'; form-action 'self' https://www.paypal.com`,
  },
];

const longTermAssetCache = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/administracion/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/admin-login",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/screenshots/:path*",
        headers: longTermAssetCache,
      },
      {
        source: "/brand/:path*",
        headers: longTermAssetCache,
      },
      {
        source: "/assets/:path*",
        headers: longTermAssetCache,
      },
      {
        source: "/images/:path*",
        headers: longTermAssetCache,
      },
      {
        source: "/og.jpg",
        headers: longTermAssetCache,
      },
      {
        source: "/og.png",
        headers: longTermAssetCache,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/supervivencia-offline", destination: "/aplicacion-supervivencia-offline", permanent: true },
      { source: "/herramientas", destination: "/herramientas-supervivencia", permanent: true },
      { source: "/aprendizaje", destination: "/aprendizaje-supervivencia", permanent: true }
    ];
  }
};

export default nextConfig;
