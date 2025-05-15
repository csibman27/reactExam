import React from "react";
import PageTemplate from '../components/templateMovieListPage';
import { BaseMovieProps } from "../types/interfaces";
import { getTrending } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/movieFilterUI";
import { DiscoverMovies } from "../types/interfaces";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites'


// const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US'

// https://api.themoviedb.org/3/trending/movie?api_key=900bc650534ac4e5a5ca7bc779a2792a&language=en-US&include_adult=false&include_video=false&page=1

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};
const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};

const TrendingPage: React.FC = () => {
  const { data, error, isLoading, isError } = useQuery<DiscoverMovies, Error>("trending", getTrending);
  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering]
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }


  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    const updatedFilterSet =
      type === "title"
        ? [changedFilter, filterValues[1]]
        : [filterValues[0], changedFilter];
    setFilterValues(updatedFilterSet);
  };

  const movies = data ? data.results : [];
  const displayedMovies = filterFunction(movies);

  // React.useEffect(() => {
  //   if (data) {
  //     console.log("Endpoint logt:", data.results);
  //   }
  // }, [data]);

  return (
    <>
      <PageTemplate
        title="Trending Movies"
        movies={displayedMovies}
        action={(movie: BaseMovieProps) => {
          return <AddToFavouritesIcon {...movie} />
        }}
      />
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
      />
    </>
  );
};
export default TrendingPage;