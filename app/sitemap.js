// app/sitemap.js
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const BASE_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Utility function untuk membuat slug
function createGenreSlug(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Fungsi untuk fetch semua genre dari API
async function getAllGenres() {
  try {
    // Fetch movie genres
    const movieResponse = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const movieData = await movieResponse.json();
    
    // Fetch TV genres
    const tvResponse = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
    const tvData = await tvResponse.json();
    
    // Combine and format genres
    const movieGenres = movieData.genres.map(genre => ({
      type: 'movie',
      slug: createGenreSlug(genre.name),
      name: genre.name
    }));
    
    const tvGenres = tvData.genres.map(genre => ({
      type: 'tv',
      slug: createGenreSlug(genre.name),
      name: genre.name
    }));
    
    return [...movieGenres, ...tvGenres];
  } catch (error) {
    console.error('Error fetching genres:', error);
    // Fallback ke genre populer jika error
    return [
      { type: 'movie', slug: 'action', name: 'Action' },
      { type: 'movie', slug: 'comedy', name: 'Comedy' },
      { type: 'movie', slug: 'drama', name: 'Drama' },
      { type: 'movie', slug: 'horror', name: 'Horror' },
      { type: 'movie', slug: 'romance', name: 'Romance' },
      { type: 'tv', slug: 'sci-fi-fantasy', name: 'Sci-Fi & Fantasy' },
      { type: 'tv', slug: 'drama', name: 'Drama' },
      { type: 'tv', slug: 'comedy', name: 'Comedy' },
      { type: 'tv', slug: 'action-adventure', name: 'Action & Adventure' },
    ];
  }
}

// Fungsi untuk fetch data dari TMDB API
async function fetchTMDBData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Fungsi untuk mendapatkan popular movies
async function getPopularMovies() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`;
  const data = await fetchTMDBData(url);
  return data?.results || [];
}

// Fungsi untuk mendapatkan popular TV shows
async function getPopularTVShows() {
  const url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=1`;
  const data = await fetchTMDBData(url);
  return data?.results || [];
}

// Fungsi untuk generate sitemap
export default async function sitemap() {
  const currentDate = new Date().toISOString();

  // URLs statis
  const staticUrls = [
    {
      url: `${BASE_SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // URLs untuk semua genre
  const allGenres = await getAllGenres();
  const genreUrls = allGenres.map(genre => ({
    url: `${BASE_SITE_URL}/genre/${genre.type}/${genre.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // URLs untuk popular movies
  const popularMovies = await getPopularMovies();
  const movieUrls = popularMovies.slice(0, 100).map(movie => ({
    url: `${BASE_SITE_URL}/movie/${movie.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // URLs untuk popular TV shows
  const popularTVShows = await getPopularTVShows();
  const tvUrls = popularTVShows.slice(0, 100).map(tv => ({
    url: `${BASE_SITE_URL}/tv/${tv.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Gabungkan semua URLs
  const allUrls = [
    ...staticUrls,
    ...genreUrls,
    ...movieUrls,
    ...tvUrls,
  ];

  return allUrls;
}