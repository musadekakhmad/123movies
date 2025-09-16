"use client";
import React, { useState, useEffect, useCallback } from 'react';
import MovieCard from '@/components/MovieCard';
import { useRouter } from 'next/navigation';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;

// Mapping nama genre ke ID (untuk fallback jika perlu)
const genreNameToId = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'science-fiction': 878,
  'sci-fi-fantasy': 10765, // TV genre
  'tv-movie': 10770,
  'thriller': 53,
  'war': 10752,
  'western': 37
};

// Utility untuk membuat slug dari nama genre yang SEO-Friendly.
const createGenreSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/&/g, 'and') // Ganti & dengan 'and'
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter khusus
    .replace(/\s+/g, '-') // Ganti spasi dengan dash
    .replace(/-+/g, '-') // Hapus multiple dash berturut-turut
    .trim();
};

// Utility untuk decode URL slug
const decodeUrlSlug = (slug) => {
  if (!slug) return '';
  // Decode URI component terlebih dahulu (mengubah %26 kembali menjadi &)
  const decoded = decodeURIComponent(slug);
  // Kemudian proses dengan createGenreSlug untuk konsistensi
  return createGenreSlug(decoded);
};

// ===================================
// Main Component
// ===================================

export default function GenrePage({ params }) {
  const { mediaType, genreName } = React.use(params);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayGenreName, setDisplayGenreName] = useState('Unknown Genre');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [genreId, setGenreId] = useState(null);
  const [genreNotFound, setGenreNotFound] = useState(false);
  const router = useRouter();

  // Function to get genre ID from name
  const getGenreIdFromName = useCallback(async () => {
    // Decode URL slug terlebih dahulu
    const decodedSlug = decodeUrlSlug(genreName);
    
    // First check our predefined mapping
    const predefinedId = genreNameToId[decodedSlug];
    if (predefinedId) {
      // Untuk mendapatkan nama display yang benar, kita perlu fetch dari API
      try {
        const res = await fetch(`${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}`);
        if (res.ok) {
          const json = await res.json();
          const genre = json.genres.find(g => g.id === predefinedId);
          if (genre) {
            setDisplayGenreName(genre.name);
          } else {
            setDisplayGenreName(decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
          }
        }
      } catch (err) {
        console.error("Fetch genre name error:", err);
        setDisplayGenreName(decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      }
      
      setGenreId(predefinedId);
      return predefinedId;
    }
    
    // If not in predefined mapping, fetch from API
    try {
      const res = await fetch(`${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const json = await res.json();
      
      // Cari genre yang matching dengan slug yang sudah diproses
      const genre = json.genres.find(g => {
        const genreSlug = createGenreSlug(g.name);
        return genreSlug === decodedSlug;
      });
      
      if (genre) {
        setGenreId(genre.id);
        setDisplayGenreName(genre.name);
        return genre.id;
      } else {
        // Jika masih tidak ditemukan, coba dengan mengganti dash dengan space
        const genreNameFromSlug = decodedSlug.replace(/-/g, ' ');
        const genreBySpace = json.genres.find(
          g => g.name.toLowerCase() === genreNameFromSlug.toLowerCase()
        );
        
        if (genreBySpace) {
          setGenreId(genreBySpace.id);
          setDisplayGenreName(genreBySpace.name);
          return genreBySpace.id;
        } else {
          // If genre not found, set not found state
          setGenreNotFound(true);
          setError(`Genre "${decodedSlug}" not found`);
        }
      }
    } catch (err) {
      console.error("Fetch genre error:", err);
      setError("Failed to fetch genre information");
      setGenreNotFound(true);
    }
  }, [mediaType, genreName]);

  // Function to fetch media by genre with pagination
  const fetchMediaByGenre = useCallback(async () => {
    if (!genreId) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const json = await res.json();
      setData(prevData => [...prevData, ...json.results]);
      setHasMore(json.page < json.total_pages);
    } catch (err) {
      setError(err.message);
      console.error("Fetch media error:", err);
    } finally {
      setLoading(false);
    }
  }, [mediaType, genreId, page]);

  // Initial data fetch and genre name fetch
  useEffect(() => {
    const initializeGenre = async () => {
      const id = await getGenreIdFromName();
      if (id) {
        setGenreId(id);
      }
    };
    
    initializeGenre();
  }, [getGenreIdFromName]);

  // Fetch media when genreId changes
  useEffect(() => {
    if (genreId) {
      // Reset data and page when genreId changes
      setData([]);
      setPage(1);
      setHasMore(true);
      
      // We'll call fetchMediaByGenre after a small delay to ensure state is updated
      setTimeout(() => {
        fetchMediaByGenre();
      }, 0);
    }
  }, [genreId, fetchMediaByGenre]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const title = `${mediaType === 'movie' ? 'Movies' : 'TV Shows'} - ${displayGenreName}`;

  if (genreNotFound) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Genre Not Found</h1>
          <p className="text-gray-400 mb-6">The genre "{genreName}" could not be found.</p>
          <button 
            onClick={() => router.back()} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
        {title}
      </h1>
      
      {loading && data.length === 0 && <p className="text-center text-gray-400">Loading...</p>}
      {error && !genreNotFound && <p className="text-center text-red-400">Error: {error}</p>}
      
      {data.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {data.filter(item => item.poster_path).map((item) => (
              <MovieCard key={item.id} media={item} mediaType={mediaType} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-300"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Show More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}