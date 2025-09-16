// Home.js
"use client";
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import MovieCard from '@/components/MovieCard';

// Gunakan environment variables untuk API key
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL || 'https://api.themoviedb.org/3';

// ===================================
// SEO Metadata
// ===================================
const seoConfig = {
  title: "123Movies - Watch Free HD Movies and TV Shows Online",
  description: "Stream thousands of free movies and TV shows in HD quality. No registration required. Popular, top-rated, upcoming and now playing content updated daily.",
  keywords: "free movies, watch movies online, HD movies, free TV shows, streaming, no registration",
  canonicalUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  ogImage: "https://live.staticflickr.com/65535/54749109544_bcd4a12179_b.jpg"
};

// ===================================
// Custom Hook to fetch API data
// ===================================
const useCategoryData = (category, mediaType = 'movie') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [displayCount, setDisplayCount] = useState(6);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/${mediaType}/${category}?api_key=${API_KEY}&page=${page}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json();
      
      setData(prevData => [...prevData, ...json.results]);
      setHasMore(json.page < json.total_pages);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [category, mediaType, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadMore = () => {
    setDisplayCount(prev => prev === 6 ? 20 : prev + 20);
    setPage(prev => prev + 1);
  };

  return {
    data,
    loading,
    error,
    hasMore,
    displayCount,
    loadMore
  };
};

// ===================================
// Home Component
// ===================================
export default function Home() {
  // Movies categories
  const popularMovies = useCategoryData('popular', 'movie');
  const topRatedMovies = useCategoryData('top_rated', 'movie');
  const upcomingMovies = useCategoryData('upcoming', 'movie');
  const nowPlayingMovies = useCategoryData('now_playing', 'movie');

  // TV Shows categories
  const popularTv = useCategoryData('popular', 'tv');
  const topRatedTv = useCategoryData('top_rated', 'tv');
  const onTheAirTv = useCategoryData('on_the_air', 'tv');
  const airingTodayTv = useCategoryData('airing_today', 'tv');

  const CategorySection = ({ 
    title, 
    data, 
    loading, 
    error, 
    hasMore, 
    onLoadMore, 
    mediaType, 
    displayCount 
  }) => (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
      {loading && data.length === 0 && (
        <p className="text-center text-gray-400">Loading {mediaType}...</p>
      )}
      {error && <p className="text-center text-red-400">Error: {error}</p>}
      {data.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {data
              .filter(item => item.poster_path)
              .slice(0, displayCount)
              .map((item) => (
                <MovieCard 
                  key={item.id} 
                  media={item} 
                  mediaType={mediaType} 
                />
              ))
            }
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={onLoadMore}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-300"
                aria-label={`Load more ${title}`}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Show More'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );

  return (
    <>
      {/* SEO Head Section */}
      <Head>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={seoConfig.canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoConfig.title} />
        <meta property="og:description" content={seoConfig.description} />
        <meta property="og:image" content={seoConfig.ogImage} />
        <meta property="og:url" content={seoConfig.canonicalUrl} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoConfig.title} />
        <meta name="twitter:description" content={seoConfig.description} />
        <meta name="twitter:image" content={seoConfig.ogImage} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "123Movies",
              "url": seoConfig.canonicalUrl,
              "description": seoConfig.description,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${seoConfig.canonicalUrl}/search/{search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white font-sans">
        
        {/* Main content */}
        <main className="px-4 md:px-8 py-8">

          {/* Hero Image - Diletakkan di bawah navbar */}
          <div className="w-full h-48 md:h-64 lg:h-96 overflow-hidden rounded-xl shadow-2xl mb-8">
            <img
              src="https://live.staticflickr.com/65535/54749109544_bcd4a12179_b.jpg"
              alt="123Movies - Stream free HD movies and TV shows online"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/1920x1080/0d1117/2d3138?text=123Movies';
              }}
            />
          </div>
          
          {/* Judul Halaman - Diletakkan di bawah gambar */}
          <div className="text-center mb-12">
             <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                123Movies
              </h1>
            <p className="text-xl text-blue-300 max-w-4xl mx-auto">
              123Movies: Your ultimate free HD hub for movies & TV shows. Stream the latest blockbusters, classic films, and binge-worthy series instantly. No registration or subscription required. Explore a vast library and enjoy top-quality entertainment anytime, anywhere. Dive in today!
            </p>
          </div>

          {/* Movies Section */}
          <section aria-labelledby="movies-heading" className="mb-16">
            <h2 id="movies-heading" className="text-3xl font-bold text-white mb-8 text-center">
              Movies
            </h2>

            <CategorySection
              title="Popular Movies"
              data={popularMovies.data}
              loading={popularMovies.loading}
              error={popularMovies.error}
              hasMore={popularMovies.hasMore}
              onLoadMore={popularMovies.loadMore}
              mediaType="movie"
              displayCount={popularMovies.displayCount}
            />

            <CategorySection
              title="Top Rated Movies"
              data={topRatedMovies.data}
              loading={topRatedMovies.loading}
              error={topRatedMovies.error}
              hasMore={topRatedMovies.hasMore}
              onLoadMore={topRatedMovies.loadMore}
              mediaType="movie"
              displayCount={topRatedMovies.displayCount}
            />

            <CategorySection
              title="Upcoming Movies"
              data={upcomingMovies.data}
              loading={upcomingMovies.loading}
              error={upcomingMovies.error}
              hasMore={upcomingMovies.hasMore}
              onLoadMore={upcomingMovies.loadMore}
              mediaType="movie"
              displayCount={upcomingMovies.displayCount}
            />
            
            <CategorySection
              title="Now Playing Movies"
              data={nowPlayingMovies.data}
              loading={nowPlayingMovies.loading}
              error={nowPlayingMovies.error}
              hasMore={nowPlayingMovies.hasMore}
              onLoadMore={nowPlayingMovies.loadMore}
              mediaType="movie"
              displayCount={nowPlayingMovies.displayCount}
            />
          </section>

          {/* TV Shows Section */}
          <section aria-labelledby="tv-shows-heading">
            <h2 id="tv-shows-heading" className="text-3xl font-bold text-white mb-8 text-center">
              TV Shows
            </h2>

            <CategorySection
              title="Popular TV Shows"
              data={popularTv.data}
              loading={popularTv.loading}
              error={popularTv.error}
              hasMore={popularTv.hasMore}
              onLoadMore={popularTv.loadMore}
              mediaType="tv"
              displayCount={popularTv.displayCount}
            />

            <CategorySection
              title="Top Rated TV Shows"
              data={topRatedTv.data}
              loading={topRatedTv.loading}
              error={topRatedTv.error}
              hasMore={topRatedTv.hasMore}
              onLoadMore={topRatedTv.loadMore}
              mediaType="tv"
              displayCount={topRatedTv.displayCount}
            />
            
            <CategorySection
              title="On The Air TV Shows"
              data={onTheAirTv.data}
              loading={onTheAirTv.loading}
              error={onTheAirTv.error}
              hasMore={onTheAirTv.hasMore}
              onLoadMore={onTheAirTv.loadMore}
              mediaType="tv"
              displayCount={onTheAirTv.displayCount}
            />
            
            <CategorySection
              title="Airing Today TV Shows"
              data={airingTodayTv.data}
              loading={airingTodayTv.loading}
              error={airingTodayTv.error}
              hasMore={airingTodayTv.hasMore}
              onLoadMore={airingTodayTv.loadMore}
              mediaType="tv"
              displayCount={airingTodayTv.displayCount}
            />
          </section>
        </main>
      </div>
    </>
  );
}
