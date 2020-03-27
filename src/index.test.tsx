import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';

import MyComponent from "./index";

it("should have the text", () => {
  const { queryByText } = render(<MyComponent />);
  expect(queryByText("React Component")).toBeInTheDocument();
});
