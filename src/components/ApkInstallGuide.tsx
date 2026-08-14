const apkInstallGuide = [
  {
    title: "Descargar el APK desde la web oficial",
    text:
      "Descarga la aplicación desde la página oficial. Cuando termine, abre la carpeta Descargas de tu móvil y toca el archivo APK de Supervivencia Offline.",
    images: [
      {
        src: "/screenshots/app/apk-guide/paso-1-descargar-web.jpg",
        alt: "Botón de descarga oficial de Supervivencia Offline en la web",
      },
      {
        src: "/screenshots/app/apk-guide/paso-1-archivo-descargas.jpg",
        alt: "Archivo APK descargado en la carpeta Descargas del móvil",
      },
      {
        src: "/screenshots/app/apk-guide/paso-1-abrir-apk.jpg",
        alt: "Archivo APK seleccionado para iniciar la instalación",
      },
    ],
  },
  {
    title: "Dar permiso temporal e instalar",
    text:
      "Android puede pedir permiso para instalar aplicaciones desde el navegador o desde Mis archivos. Entra en Ajustes, permite instalar desde esa fuente y vuelve para completar la instalación. Después puedes desactivar ese permiso si quieres.",
    images: [
      {
        src: "/screenshots/app/apk-guide/paso-2-aviso-android.jpg",
        alt: "Aviso de Android antes de instalar una aplicación externa",
      },
      {
        src: "/screenshots/app/apk-guide/paso-2-permiso-fuente.jpg",
        alt: "Pantalla de Android para permitir instalar desde esta fuente",
      },
      {
        src: "/screenshots/app/apk-guide/paso-2-instalar-app.jpg",
        alt: "Pantalla final de instalación de la aplicación",
      },
    ],
  },
];

export function ApkInstallGuide({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`map-install-guide apk-install-guide${compact ? " apk-install-guide-compact" : ""}`} aria-labelledby="apk-install-guide-title">
      <div className="section-heading compact-heading">
        <p className="eyebrow">Guía de instalación</p>
        <h3 id="apk-install-guide-title">Cómo instalar la aplicación en Android</h3>
        {!compact ? (
          <p>
            Instala siempre el APK desde la web oficial. Android puede mostrar avisos porque la app se instala fuera de
            Google Play; concede permisos solo si reconoces el archivo descargado.
          </p>
        ) : null}
      </div>

      <div className="map-install-steps">
        {apkInstallGuide.map((step, index) => (
          <article className="map-install-step" key={step.title}>
            <div className="map-install-step-copy">
              <span>Paso {index + 1}</span>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
            <div className="map-install-images map-install-images-triple">
              {step.images.map((image) => (
                <img src={image.src} alt={image.alt} key={image.src} loading="lazy" />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
