import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as useMoviesHook from "../hooks/useMovies";
import { Movies } from "./Movies";

jest.mock("../hooks/useMovies");
jest.mock("../services/api", () => ({
  logout: jest.fn(),
}));

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <Movies />
    </MemoryRouter>
  );

describe("Movies page", () => {
  it("shows loading state while movies are being fetched", () => {
    (useMoviesHook.useMovies as jest.Mock).mockReturnValue({
      movies: [],
      isLoading: true,
      error: null,
    });

    renderWithRouter();

    expect(
      screen.getByText(/Loading your movies.../i)
    ).toBeInTheDocument();
  });

  it("shows empty state when there are no movies", () => {
    (useMoviesHook.useMovies as jest.Mock).mockReturnValue({
      movies: [],
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(
      screen.getByText(/Your movie list is empty/i)
    ).toBeInTheDocument();
  });

  it("renders movies when data is available", () => {
    (useMoviesHook.useMovies as jest.Mock).mockReturnValue({
      movies: [
        {
          _id: "1",
          title: "Movie 1",
          publishYear: 2020,
          image: { type: "Buffer", data: [] },
        },
      ],
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(screen.getByText("Movie 1")).toBeInTheDocument();
  });

  it("shows error state when hook reports an error", () => {
    (useMoviesHook.useMovies as jest.Mock).mockReturnValue({
      movies: [],
      isLoading: false,
      error: "Failed to load movies",
    });

    renderWithRouter();

    expect(
      screen.getByText(/Unable to load movies/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Failed to load movies/i)
    ).toBeInTheDocument();
  });
});

