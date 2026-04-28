/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', //genera una aplicacion mas ligera y optimizada para producción, eliminando archivos innecesarios y reduciendo el tamaño del bundle final.

  // Headers de seguridad para proteger contra ataques, mejorar la privacidad y evitar que el contenido sea embebido en otros sitios.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;