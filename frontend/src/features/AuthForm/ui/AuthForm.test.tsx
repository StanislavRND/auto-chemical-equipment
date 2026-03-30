import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useAuthForm } from "../model/useAuthForm";
import { AuthForm } from "./AuthForm";

vi.mock("../model/useAuthForm", () => ({
  useAuthForm: vi.fn(),
}));

describe("AuthForm", () => {
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuthForm as Mock).mockReturnValue({
      formData: { email: "", password: "" },
      touched: { email: false, password: false },
      emailError: "",
      passwordError: "",
      isPending: false,
      apiErrorMessage: "",
      handleBlur: vi.fn(),
      handleChange: vi.fn(),
      handleSubmit: mockHandleSubmit,
    });
  });

  it("отправляет форму", () => {
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>,
    );

    const form = document.querySelector("form");
    fireEvent.submit(form!);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("отображает ошибки валидации", () => {
    (useAuthForm as Mock).mockReturnValue({
      formData: { email: "", password: "" },
      touched: { email: true, password: true },
      emailError: "Неверный email",
      passwordError: "Пароль слишком короткий",
      isPending: false,
      apiErrorMessage: "",
      handleBlur: vi.fn(),
      handleChange: vi.fn(),
      handleSubmit: mockHandleSubmit,
    });

    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>,
    );

    expect(screen.getByText("Неверный email")).toBeInTheDocument();
    expect(screen.getByText("Пароль слишком короткий")).toBeInTheDocument();
  });

  it("отображает API ошибку", () => {
    (useAuthForm as Mock).mockReturnValue({
      formData: { email: "", password: "" },
      touched: { email: false, password: false },
      emailError: "",
      passwordError: "",
      isPending: false,
      apiErrorMessage: "Неверный email или пароль",
      handleBlur: vi.fn(),
      handleChange: vi.fn(),
      handleSubmit: mockHandleSubmit,
    });

    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>,
    );

    expect(screen.getByText("Неверный email или пароль")).toBeInTheDocument();
  });
});