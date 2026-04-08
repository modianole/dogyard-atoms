import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/context/LanguageContext";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

const renderWithLanguage = (ui: ReactNode) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

describe("legal pages", () => {
  it("renders the privacy policy page in Hebrew by default", () => {
    renderWithLanguage(<Privacy />);

    expect(screen.getByRole("heading", { name: "מדיניות פרטיות" })).toBeInTheDocument();
    expect(screen.getByText(/איזה מידע נאסף/)).toBeInTheDocument();
  });

  it("renders the terms of service page in Hebrew by default", () => {
    renderWithLanguage(<Terms />);

    expect(screen.getByRole("heading", { name: "תנאי שימוש" })).toBeInTheDocument();
    expect(screen.getByText(/קבלת התנאים/)).toBeInTheDocument();
  });
});


