import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import registrationReducer from "@features/ConfirmCodeForm/model/registrationSlice";
import { RegisterForm } from "./RegisterForm";

const mockOnSuccess = vi.fn();

const createStore = () =>
  configureStore({
    reducer: {
      registration: registrationReducer,
    },
  });

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (typeRegister: "person" | "legal") => {
    const store = createStore();
    const queryClient = createQueryClient();

    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RegisterForm
              typeRegister={typeRegister}
              onSuccess={mockOnSuccess}
            />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>,
    );
  };

  it("отображает поля для физического лица", () => {
    renderForm("person");

    expect(screen.getByLabelText("ФИО")).toBeInTheDocument();
    expect(screen.getByLabelText("Телефон")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(screen.getByLabelText("Подтвердить пароль")).toBeInTheDocument();
  });

  it("отображает поля для юридического лица", () => {
    renderForm("legal");

    expect(screen.getByLabelText("ИНН")).toBeInTheDocument();
    expect(screen.getByLabelText("КПП")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Юридическое наименование"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Юридический адрес")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  it("кнопка заблокирована если не принято соглашение", () => {
    renderForm("person");

    const button = screen.getByRole("button", { name: "Зарегистрироваться" });
    expect(button).toBeDisabled();
  });

  it("кнопка активна после принятия соглашения", () => {
    renderForm("person");

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const button = screen.getByRole("button", { name: "Зарегистрироваться" });
    expect(button).not.toBeDisabled();
  });

  it("отображает ошибки валидации", async () => {
    renderForm("person");

    const emailInput = screen.getByLabelText("E-mail");
    fireEvent.blur(emailInput);

    const error = await screen.findByText("Обязательное поле");
    expect(error).toBeInTheDocument();
  });
});
