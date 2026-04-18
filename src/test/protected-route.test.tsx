import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, beforeEach, expect } from "vitest";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe("ProtectedRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("redirects guests to auth and preserves next path", () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false } as any);

    render(
      <MemoryRouter initialEntries={["/profile?tab=dogs#top"]}>
        <Routes>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Protected content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<div>Auth page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Auth page")).toBeInTheDocument();
    expect(sessionStorage.getItem("auth:next")).toBe("/profile?tab=dogs#top");
  });

  it("renders children for authenticated users", () => {
    mockedUseAuth.mockReturnValue({ user: { id: "user-1" }, loading: false } as any);

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Protected content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<div>Auth page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });
});
