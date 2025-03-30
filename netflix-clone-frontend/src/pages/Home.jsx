import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = "7529868675ff4fe4a423aae8ba78f36e";

const Home = () => {
  const [trendingContent, setTrendingContent] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Refs for scrolling containers
  const trendingRef = useRef(null);
  const popularRef = useRef(null);
  const topRatedRef = useRef(null);
  const upcomingRef = useRef(null);

  // Auto scroll functionality
  useEffect(() => {
    const scrollContainers = [
      trendingRef,
      popularRef,
      topRatedRef,
      upcomingRef,
    ];
    const scrollInterval = 10000; // 10 seconds between scrolls

    const autoScroll = (containerRef) => {
      if (containerRef.current) {
        const scrollAmount = containerRef.current.clientWidth * 0.75; // Scroll 75% of visible width
        containerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });

        // Reset to beginning if we've scrolled far enough
        if (
          containerRef.current.scrollLeft + containerRef.current.clientWidth >=
          containerRef.current.scrollWidth - 200
        ) {
          setTimeout(() => {
            containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
          }, 1000);
        }
      }
    };

    const intervals = scrollContainers.map((ref, index) => {
      return setInterval(() => autoScroll(ref), scrollInterval + index * 2000); // Stagger the scrolling
    });

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [trendingContent, popularMovies, topRatedShows, upcomingMovies]);

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        setLoading(true);

        // Fetch trending content
        const trendingResponse = await fetch(
          `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`
        );
        const trendingData = await trendingResponse.json();

        // Fetch popular movies
        const popularResponse = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`
        );
        const popularData = await popularResponse.json();

        // Fetch top rated TV shows
        const topRatedResponse = await fetch(
          `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en-US`
        );
        const topRatedData = await topRatedResponse.json();

        // Fetch upcoming movies
        const upcomingResponse = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US`
        );
        const upcomingData = await upcomingResponse.json();

        setTrendingContent(trendingData.results || []);
        setPopularMovies(popularData.results || []);
        setTopRatedShows(topRatedData.results || []);
        setUpcomingMovies(upcomingData.results || []);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  const referralLink = `${window.location.origin}/register?ref=${user?.id}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  // Function for scroll buttons
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Content row component to avoid repetition
  const ContentRow = ({ title, content, containerRef }) => {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {loading ? (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[240px] h-[360px] bg-gray-800 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="relative group">
            <div
              className="flex space-x-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
              ref={containerRef}
              style={{
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
              }}
            >
              {/* Additional CSS for Webkit browsers*/}
              <style jsx>{`
                div.no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {content.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[240px] group/item relative"
                  onClick={() => navigate(`/watch/${item.id}`)}
                >
                  <div className="overflow-hidden rounded shadow-md cursor-pointer transform transition group-hover/item:scale-105 group-hover/item:shadow-xl">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-full h-[360px] object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/240x360?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="font-bold">{item.title || item.name}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-green-500 text-sm">
                          {Math.round(item.vote_average * 10)}% Match
                        </span>
                        <span className="text-xs border px-1">
                          {item.adult ? "18+" : "PG"}
                        </span>
                        <span className="text-xs">
                          {item.release_date?.substring(0, 4) ||
                            item.first_air_date?.substring(0, 4)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex space-x-2">
                          <button className="bg-white text-black rounded-full p-1 hover:bg-opacity-80">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                          <button className="border border-gray-400 rounded-full p-1 hover:border-white">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.707 3.293a1 1 0 010 1.414l-1 1a1 1 0 11-1.414-1.414l1-1a1 1 0 011.414 0zm-9.193 9.193a1 1 0 010 1.414l-1 1a1 1 0 11-1.414-1.414l1-1a1 1 0 011.414 0zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm14 0a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-7 4a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zm-2-8a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"></path>
                            </svg>
                          </button>
                        </div>
                        <button className="border border-gray-400 rounded-full p-1 hover:border-white">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={() => scroll(containerRef, "left")}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={() => scroll(containerRef, "right")}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#141414] text-white min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-12 py-4 bg-gradient-to-b from-black/80 to-transparent fixed w-full z-10">
        <div className="flex items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png"
            alt="Netflix"
            className="h-7"
          />
          <nav className="ml-8 hidden md:flex">
            <ul className="flex space-x-6">
              <li className="text-sm font-medium">Home</li>
              <li className="text-sm text-gray-300 hover:text-white">
                TV Shows
              </li>
              <li className="text-sm text-gray-300 hover:text-white">Movies</li>
              <li className="text-sm text-gray-300 hover:text-white">
                New & Popular
              </li>
              <li className="text-sm text-gray-300 hover:text-white">
                My List
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
          </svg>
          <div className="relative group">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="Profile"
              className="h-8 w-8 rounded cursor-pointer"
            />
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <div
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate("/profile-management")}
              >
                Manage Profiles
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={copyReferral}
              >
                Refer & Earn €2
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate("/account")}
              >
                Account
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                Sign out
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      {trendingContent.length > 0 && (
        <div className="relative h-[80vh] w-full">
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/original${trendingContent[0]?.backdrop_path}`}
              alt={trendingContent[0]?.title || trendingContent[0]?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30"></div>
          </div>

          <div className="relative h-full flex flex-col justify-end pb-20 px-12">
            <h1 className="text-5xl font-bold max-w-2xl mb-4">
              {trendingContent[0]?.title || trendingContent[0]?.name}
            </h1>
            <p className="text-lg max-w-xl mb-6">
              {trendingContent[0]?.overview?.substring(0, 150)}...
            </p>
            <div className="flex space-x-4">
              <button
                className="bg-white text-black px-6 py-2 rounded flex items-center font-medium hover:bg-opacity-80 transition"
                onClick={() => navigate(`/watch/${trendingContent[0]?.id}`)}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Play
              </button>
              <button className="bg-gray-600/70 text-white px-6 py-2 rounded flex items-center font-medium hover:bg-gray-500/70 transition">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.707 3.293a1 1 0 010 1.414l-1 1a1 1 0 11-1.414-1.414l1-1a1 1 0 011.414 0zm-9.193 9.193a1 1 0 010 1.414l-1 1a1 1 0 11-1.414-1.414l1-1a1 1 0 011.414 0zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm14 0a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-7 4a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zm-2-8a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Rows */}
      <div className="relative z-10 px-12 pb-12 -mt-16">
        {/* Trending Now Row */}
        <ContentRow
          title="Trending Now"
          content={trendingContent}
          containerRef={trendingRef}
        />

        {/* Popular Movies Row */}
        <ContentRow
          title="Popular Movies"
          content={popularMovies}
          containerRef={popularRef}
        />

        {/* Top Rated TV Shows Row */}
        <ContentRow
          title="Top Rated TV Shows"
          content={topRatedShows}
          containerRef={topRatedRef}
        />

        {/* Upcoming Movies Row */}
        <ContentRow
          title="Coming Soon"
          content={upcomingMovies}
          containerRef={upcomingRef}
        />
      </div>
    </div>
  );
};

export default Home;
