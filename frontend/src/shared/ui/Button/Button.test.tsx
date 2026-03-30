import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("рендерит текст", () => {
    render(<Button>Купить</Button>);

    expect(screen.getByText("Купить")).toBeInTheDocument();
  });
});
