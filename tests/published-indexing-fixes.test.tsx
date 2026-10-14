// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { allContentPages } from '../src/content/pages';
import { downloadInfo } from '../src/content/downloads';
import { visibleContentPages } from '../src/lib/visible-content-pages';
import { AppReleaseProvider, AppReleaseVersion, AppReleaseUpdateNotice, AppReleaseDownloadButton } from '../src/components/AppRelease';
import { dynamic } from '../app/aplicacion-supervivencia-offline/page';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function Release() {
  return <AppReleaseProvider><AppReleaseVersion /><AppReleaseUpdateNotice /><AppReleaseDownloadButton /></AppReleaseProvider>;
}
describe('published indexing repairs', () => {
  it('keeps new bundled pages with a legacy saved page list, preserving saved edits and custom pages', () => {
    const custom = { ...allContentPages[0], slug: 'personalizada', title: 'Mi página' };
    const edited = { ...allContentPages[0], title: 'Edición guardada' };
    const pages = visibleContentPages([edited, custom]);
    expect(pages.find(page => page.slug === 'sobre-nosotros')).toBeDefined();
    expect(pages.find(page => page.slug === edited.slug)?.title).toBe(edited.title);
    expect(pages.find(page => page.slug === custom.slug)).toEqual(custom);
    expect(new Set(pages.map(page => page.slug)).size).toBe(pages.length);
    expect(visibleContentPages([{ ...allContentPages[0], slug: 'cookies', title: 'Aviso antiguo' }]).find(page => page.slug === 'cookies')?.title).not.toBe('Aviso antiguo');
  });
  it('prerenders the app presentation while retaining a download and version in HTML', () => {
    expect(dynamic).toBe('force-static');
    const html = renderToStaticMarkup(<Release />);
    expect(html).toContain(downloadInfo.version);
    expect(html).toContain('Descargar aplicacion para Android');
  });
  it('refreshes the version and only displays a new-update notice when explicitly enabled', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ latestVersionLabel: 'V 9.8', showWebUpdateNotice: true }) });
    vi.stubGlobal('fetch', fetch);
    render(<Release />);
    await waitFor(() => expect(screen.getByRole('button', { name: /Descargar aplicacion.*V 9.8/ })).toBeTruthy());
    expect(screen.getByRole('link', { name: /Ver nueva actualización/ })).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(1);
    cleanup();
    fetch.mockResolvedValue({ ok: true, json: async () => ({ latestVersionLabel: 'V 9.9', showWebUpdateNotice: false }) });
    render(<Release />);
    await waitFor(() => expect(screen.getByRole('button', { name: /Descargar aplicacion.*V 9.9/ })).toBeTruthy());
    expect(screen.queryByRole('link', { name: /Ver nueva actualización/ })).toBeNull();
  });
  it('keeps the bundled working version if the release service fails or returns malformed data', async () => {
    const fetch = vi.fn().mockRejectedValue(new Error('Unavailable'));
    vi.stubGlobal('fetch', fetch);
    render(<Release />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button', { name: new RegExp(downloadInfo.version) })).toBeTruthy();
    cleanup();
    fetch.mockResolvedValue({ ok: true, json: async () => ({ latestVersionLabel: 42 }) });
    render(<Release />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(screen.getByRole('button', { name: new RegExp(downloadInfo.version) })).toBeTruthy();
  });
});
