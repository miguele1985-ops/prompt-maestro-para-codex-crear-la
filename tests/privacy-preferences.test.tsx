import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieBanner } from "../src/components/CookieBanner";
import { StatsTracker, trackDownload, trackDonation } from "../src/components/StatsTracker";
import { analyticsAllowed, readPrivacyPreferences, savePrivacyPreferences } from "../src/lib/privacy-preferences";

vi.mock("next/navigation", () => ({ usePathname: () => "/supervivencia" }));
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  savePrivacyPreferences(false);
  localStorage.clear();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  Object.defineProperty(navigator, "sendBeacon", { configurable: true, value: vi.fn().mockReturnValue(true) });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("specific optional statistics consent", () => {
  it("defaults to no collection and does not reuse legacy generic acceptance", () => {
    expect(analyticsAllowed()).toBe(false);
    localStorage.setItem("mcs-cookie-consent", "accepted");
    expect(readPrivacyPreferences()).toBeNull();
    trackDownload("/apk"); trackDonation("5");
    expect(navigator.sendBeacon).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  });
  it("honors rejection and revocation for all event types", () => {
    savePrivacyPreferences(false); trackDownload();
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    savePrivacyPreferences(true); trackDownload(); trackDonation();
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(2);
    savePrivacyPreferences(false); trackDownload(); trackDonation();
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(2);
  });
  it("responds to a choice without recording an unconsented visit marker", async () => {
    render(<StatsTracker />);
    expect(sessionStorage.length).toBe(0);
    savePrivacyPreferences(true);
    await waitFor(() => expect(navigator.sendBeacon).toHaveBeenCalledTimes(1));
    savePrivacyPreferences(true);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);
  });
  it("saves the selected category, including when reopening preferences", async () => {
    render(<CookieBanner />);
    await userEvent.click(await screen.findByRole("button", { name: "Configurar" }));
    const option = screen.getByRole("checkbox", { name: /Contadores/ });
    expect(option).not.toBeChecked();
    await userEvent.click(option);
    await userEvent.click(screen.getByRole("button", { name: /Guardar preferencias/ }));
    expect(analyticsAllowed()).toBe(true);
    await userEvent.click(screen.getByRole("button", { name: /Preferencias de cookies/ }));
    expect(screen.getByRole("checkbox", { name: /Contadores/ })).toBeChecked();
    await userEvent.click(screen.getByRole("button", { name: /Rechazar/ }));
    expect(analyticsAllowed()).toBe(false);
  });
  it("fails closed when storage is inaccessible", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Unavailable"); });
    expect(analyticsAllowed()).toBe(false);
    expect(() => trackDownload()).not.toThrow();
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
  });
  it("does not retain a prior acceptance when saving revocation fails", () => {
    savePrivacyPreferences(true);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Unavailable"); });
    savePrivacyPreferences(false);
    trackDownload();
    expect(analyticsAllowed()).toBe(false);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
  });
});
