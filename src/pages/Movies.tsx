import { Button } from "components/Button";
import { ReactComponent as PlusIcon } from "assets/plus-icon.svg";
import { ReactComponent as LogoutIcon } from "assets/logout-icon.svg";
import { MovieCard } from "components/MovieCard";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "constants/routes";
import { logout } from "../services/api";
import { useMovies, Movie } from "../hooks/useMovies";

export const Movies = (): JSX.Element => {
  const navigate = useNavigate();
  const { movies, isLoading, error } = useMovies();

  const handleEditClick = (movie: any) => {
    navigate(`${ROUTES.editMovie}/${movie._id}/edit`, { state: { movie } });
  };

  const handleLogout = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      await logout(userToken);
      localStorage.removeItem('userToken');
      navigate(ROUTES.signin);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <h1 className="mb-6 text-3xl text-white">Loading your movies...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <h1 className="mb-4 text-3xl text-white">Unable to load movies</h1>
        <p className="mb-6 text-white opacity-80">{error}</p>
        <Button onClick={() => navigate(ROUTES.signin)}>Back to sign in</Button>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <h1 className="mb-6 text-5xl text-white">Your movie list is empty</h1>
        <Button onClick={() => navigate(ROUTES.newMovie)}>Add a new movie</Button>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="flex items-center justify-between mb-32">
        <span className="flex gap-2 items-center">
          <h1 className="text-5xl text-white">My Movies</h1>
          <button onClick={() => navigate(ROUTES.newMovie)}>
            <PlusIcon className="mt-2" />
          </button>
        </span>
        <button className="flex items-center gap-2 text-white" onClick={handleLogout}>
          Logout <LogoutIcon />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-y-6">
        {movies.map((movie: Movie) => (
          <MovieCard
            key={movie._id}
            title={movie.title}
            year={String(movie.publishYear)}
            image={
              movie.image && movie.image.type === "Buffer"
                ? convertBufferToImage(movie.image.data)
                : ""
            }
            onEditClick={() => handleEditClick(movie)}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to convert a backend-provided Buffer-like array into an object URL.
// In tests, window.URL.createObjectURL is mocked to avoid touching browser internals.
const convertBufferToImage = (buffer: number[]) => {
  if (!buffer || buffer.length === 0) {
    return "";
  }
  const arrayBufferView = new Uint8Array(buffer);
  const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
  const urlCreator: Pick<URL, "createObjectURL"> | typeof window = (window as any)
    .URL || (window as any).webkitURL;
  if (!urlCreator || typeof (urlCreator as any).createObjectURL !== "function") {
    return "";
  }
  return (urlCreator as any).createObjectURL(blob);
};
