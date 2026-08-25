import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ContactForm } from "../src/components/ContactForm";
import { CookieBanner } from "../src/components/CookieBanner";
import { FaqAccordion } from "../src/components/Interactive";
import { faqs } from "../src/content/faqs";

describe("interactive components", () => {
  it("renders FAQ accordion with visible questions", () => {
    render(React.createElement(FaqAccordion, { items: faqs.slice(0, 2) }));
    expect(screen.getByText(/funciona sin Internet/)).toBeInTheDocument();
  });

  it("validates the contact form", async () => {
    render(React.createElement(ContactForm));
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
    expect(screen.getByRole("alert")).toHaveTextContent("Revisa");
  });

  it("stores cookie rejection", async () => {
    localStorage.clear();
    render(React.createElement(CookieBanner));
    await userEvent.click(await screen.findByRole("button", { name: /rechazar/i }));
    expect(localStorage.getItem("mcs-cookie-consent")).toBe("rejected");
  });
});
