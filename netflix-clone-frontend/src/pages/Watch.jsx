import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_KEY = "1be2070643bf5b4ee4e702855316cbdb";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Fetch movie details
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then(response => response.json())
      .then(data => {
        if (data.success === false) {
          // Try TV show endpoint if movie fails
          return fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`);
        }
        return Promise.resolve({ json: () => data, isMovie: true });
      })
      .then(response => {
        if (response.json) return { data: response.json(), isMovie: response.isMovie };
        return response.json().then(data => ({ data, isMovie: false }));
      })
      .then(({ data, isMovie }) => {
        setMovieDetails(data);
        
        // Fetch videos for the content
        const videoEndpoint = isMovie 
          ? `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
          : `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`;
          
        return fetch(videoEndpoint);
      })
      .then(response => response.json())
      .then(data => {
        // Find trailer or teaser or any video
        const trailer = data.results?.find(video => video.type === "Trailer" && video.site === "YouTube") || 
                       data.results?.find(video => video.type === "Teaser" && video.site === "YouTube") ||
                       data.results?.[0];
                       
        if (trailer) {
          setVideoUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&rel=0`);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="flex items-center p-4 fixed top-0 w-full z-10 bg-gradient-to-b from-black to-transparent">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-gray-300 hover:text-white"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Browse
        </button>
      </header>

      <div className="pt-16 pb-8 px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading video...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-bold">Video Unavailable</h2>
            <p className="mt-2 text-gray-400">Sorry, we couldn't find a trailer for this content.</p>
            <button 
              onClick={handleGoBack}
              className="mt-6 bg-red-600 px-6 py-2 rounded font-medium hover:bg-red-700 transition"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="aspect-video w-full bg-gray-900 shadow-lg rounded-lg overflow-hidden">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  title={movieDetails?.title || movieDetails?.name}
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No trailer available</p>
                </div>
              )}
            </div>

            {movieDetails && (
              <div className="mt-8">
                <h1 className="text-3xl font-bold">{movieDetails.title || movieDetails.name}</h1>
                
                <div className="flex items-center mt-2 text-sm text-gray-400">
                  {movieDetails.release_date && (
                    <span>{new Date(movieDetails.release_date).getFullYear()}</span>
                  )}
                  {movieDetails.first_air_date && (
                    <span>{new Date(movieDetails.first_air_date).getFullYear()}</span>
                  )}
                  
                  {(movieDetails.runtime || movieDetails.episode_run_time?.length > 0) && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{movieDetails.runtime || movieDetails.episode_run_time?.[0]} min</span>
                    </>
                  )}
                  
                  {movieDetails.vote_average && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {movieDetails.vote_average.toFixed(1)}
                      </span>
                    </>
                  )}
                </div>
                
                <p className="mt-4 text-gray-300">{movieDetails.overview}</p>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {movieDetails.genres?.map(genre => (
                    <span key={genre.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <div className="mt-8 flex space-x-4">
                  <button 
                    onClick={handleGoBack}
                    className="bg-white text-black px-6 py-2 rounded flex items-center font-medium hover:bg-opacity-80 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                    </svg>
                    Play
                  </button>
                  <button className="border border-gray-400 px-6 py-2 rounded flex items-center font-medium hover:bg-gray-700 transition">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    My List
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;