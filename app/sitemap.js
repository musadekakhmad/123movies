// app/sitemap.js
const BASE_URL = 'https://123movies123.netlify.app';

// Fungsi utilitas untuk membuat slug
const createSlug = (name, year) => {
  if (!name) return '';
  
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  // Validasi tahun lebih ketat
  if (!year || typeof year !== 'string' || year.length !== 4 || isNaN(year)) {
    return baseSlug;
  }
  
  return `${baseSlug}-${year}`;
};

// Data statis untuk genre film dan TV
const movieGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const tvGenres = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' }
];

// Data contoh untuk film dan serial TV
const sampleMovies = [
  { id: 1, title: 'The Avengers', release_date: '2012-05-04' },
  { id: 2, title: 'Avatar', release_date: '2009-12-18' },
  { id: 3, title: 'Titanic', release_date: '1997-12-19' },
  { id: 4, title: 'Jurassic Park', release_date: '1993-06-11' },
  { id: 5, title: 'The Dark Knight', release_date: '2008-07-18' },
  { id: 6, title: 'Inception', release_date: '2010-07-16' },
  { id: 7, title: 'Interstellar', release_date: '2014-11-07' },
  { id: 8, title: 'The Matrix', release_date: '1999-03-31' },
  { id: 9, title: 'Forrest Gump', release_date: '1994-07-06' },
  { id: 10, title: 'Pulp Fiction', release_date: '1994-10-14' }
];

const sampleTvShows = [
  { id: 1, name: 'Breaking Bad', first_air_date: '2008-01-20' },
  { id: 2, name: 'Game of Thrones', first_air_date: '2011-04-17' },
  { id: 3, name: 'Stranger Things', first_air_date: '2016-07-15' },
  { id: 4, name: 'The Walking Dead', first_air_date: '2010-10-31' },
  { id: 5, name: 'Friends', first_air_date: '1994-09-22' },
  { id: 6, name: 'The Office', first_air_date: '2005-03-24' },
  { id: 7, name: 'The Crown', first_air_date: '2016-11-04' },
  { id: 8, name: 'The Mandalorian', first_air_date: '2019-11-12' },
  { id: 9, name: 'The Witcher', first_air_date: '2019-12-20' },
  { id: 10, name: 'Money Heist', first_air_date: '2017-05-02' }
];

export default async function sitemap() {
  const movieCategories = ['popular', 'now_playing', 'upcoming', 'top_rated'];
  const tvCategories = ['popular', 'airing_today', 'on_the_air', 'top_rated'];

  try {
    console.log('Membuat sitemap untuk 123movies123.netlify.app...');

    // Buat URL statis, kategori, dan genre
    const staticUrls = [
      { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/adult/adult-movies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
      { url: `${BASE_URL}/adult/erotic-movies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ];

    const movieCategoryUrls = movieCategories.map((category) => ({
      url: `${BASE_URL}/movie/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    }));

    const tvCategoryUrls = tvCategories.map((category) => ({
      url: `${BASE_URL}/tv-show/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    }));
    
    const movieGenreUrls = movieGenres.map((genre) => ({
      url: `${BASE_URL}/movie/genre-${genre.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }));
    
    const tvGenreUrls = tvGenres.map((genre) => ({
      url: `${BASE_URL}/tv-show/genre-${genre.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }));

    // Buat URL slug film dari data contoh
    const movieSlugUrls = sampleMovies.map((movie) => {
      const year = movie.release_date?.substring(0, 4);
      return {
        url: `${BASE_URL}/movie/${createSlug(movie.title, year)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
      };
    });

    const movieStreamUrls = sampleMovies.map((movie) => {
      const year = movie.release_date?.substring(0, 4);
      return {
        url: `${BASE_URL}/movie/${createSlug(movie.title, year)}/stream`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
      };
    });

    // Buat URL slug serial TV dari data contoh
    const tvSlugUrls = sampleTvShows.map((tvShow) => {
      const year = tvShow.first_air_date?.substring(0, 4);
      return {
        url: `${BASE_URL}/tv-show/${createSlug(tvShow.name, year)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
      };
    });

    const tvStreamUrls = sampleTvShows.map((tvShow) => {
      const year = tvShow.first_air_date?.substring(0, 4);
      return {
        url: `${BASE_URL}/tv-show/${createSlug(tvShow.name, year)}/stream`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
      };
    });

    const allUrls = [
      ...staticUrls,
      ...movieCategoryUrls,
      ...tvCategoryUrls,
      ...movieGenreUrls,
      ...tvGenreUrls,
      ...movieSlugUrls,
      ...movieStreamUrls,
      ...tvSlugUrls,
      ...tvStreamUrls,
    ];

    console.log(`Total URL dalam sitemap: ${allUrls.length}`);
    console.log('Sitemap berhasil dibuat');

    return allUrls;

  } catch (error) {
    console.error("Kesalahan saat membuat sitemap:", error);
    
    // Return minimal sitemap dengan URL utama jika error
    return [
      { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/adult/adult-movies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
      { url: `${BASE_URL}/adult/erotic-movies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ];
  }
}
