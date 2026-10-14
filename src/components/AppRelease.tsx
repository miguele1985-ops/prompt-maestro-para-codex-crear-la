"use client";

import Link from 'next/link';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { downloadInfo } from '@/content/downloads';
import { officialApkUrl } from '@/content/site-config';
import { DownloadCard } from './DownloadCard';
import { DownloadDonationGate } from './DownloadDonationGate';

const ReleaseContext = createContext(downloadInfo);

export function AppReleaseProvider({ children }: { children: ReactNode }) {
  const [release, setRelease] = useState(downloadInfo);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/app-version.json', { cache: 'no-store', signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (!data || typeof data.latestVersionLabel !== 'string' || !data.latestVersionLabel.trim()) return;
        setRelease(previous => ({
          ...previous,
          version: data.latestVersionLabel,
          showWebUpdateNotice: data.showWebUpdateNotice === true,
          ...(typeof data.apkSize === 'string' ? { size: data.apkSize } : {}),
          ...(typeof data.publishedAt === 'string' ? { date: data.publishedAt } : {}),
          ...(typeof data.apkSha256 === 'string' ? { sha256: data.apkSha256 } : {}),
          ...(typeof data.minimumAndroidVersion === 'string' ? { minimumAndroidVersion: data.minimumAndroidVersion } : {}),
        }));
      }).catch(() => null);
    return () => controller.abort();
  }, []);
  return <ReleaseContext.Provider value={release}>{children}</ReleaseContext.Provider>;
}

export function AppReleaseDownloadButton() {
  const release = useContext(ReleaseContext);
  return <DownloadDonationGate apkUrl={officialApkUrl} label="Descargar aplicacion para Android" version={release.version} />;
}
export function AppReleaseUpdateNotice() {
  const release = useContext(ReleaseContext);
  return release.showWebUpdateNotice ? <Link className="update-notice-button update-notice-button-new" href="/actualizaciones" aria-label="Ver nueva actualización de Modo Crisis Survival"><span>Nueva actualización</span><strong>{release.version}</strong></Link> : null;
}
export function AppReleaseVersion() {
  return <span>{useContext(ReleaseContext).version}</span>;
}
export function AppReleaseDownloadCard() {
  return <DownloadCard info={{ ...useContext(ReleaseContext), apkUrl: officialApkUrl }} />;
}
