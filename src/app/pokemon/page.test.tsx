import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

test("RSC Pokemon Page", async () => {
  render(await Page());
  expect(screen.findByText("bulbasaur")).toBeDefined();
});
