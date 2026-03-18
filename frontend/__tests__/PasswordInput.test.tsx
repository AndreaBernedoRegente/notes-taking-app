import { render, screen, fireEvent } from "@testing-library/react";
import PasswordInput from "@/components/auth/PasswordInput";

describe("PasswordInput", () => {
  it("renders password input hidden by default", () => {
    render(<PasswordInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("toggles password visibility when eye button is clicked", () => {
    render(<PasswordInput value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText("Password");
    const toggleBtn = screen.getByRole("button");

    expect(input).toHaveAttribute("type", "password");
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls onChange when user types", () => {
    const handleChange = jest.fn();
    render(<PasswordInput value="" onChange={handleChange} />);
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "newpassword" },
    });
    expect(handleChange).toHaveBeenCalledWith("newpassword");
  });

  it("renders custom placeholder", () => {
    render(
      <PasswordInput
        value=""
        onChange={() => {}}
        placeholder="Enter password"
      />,
    );
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
  });
});
