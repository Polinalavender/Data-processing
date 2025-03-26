// ProfileManagement.jsx - Updated with NavBar integration and profile context
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Import the updated Navbar

// In a real application, this would come from a context or Redux store
// For this example, creating a stub implementation
const ProfileContext = React.createContext();
const useProfiles = () => useContext(ProfileContext);

const ProfileManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: "",
    age: 0,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
    preferences: {
      contentType: "both", // "movies", "series", or "both"
      genres: [],
      minAge: 0,
      classifications: []
    }
  });
  const navigate = useNavigate();

  // Available options for preferences
  const genreOptions = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Documentary"];
  const classificationOptions = [
    "All ages", "6 years and over", "9 years and over", "12 years and over", "16 years and over",
    "Violence", "Sex", "Terror", "Discrimination", "Drug and alcohol abuse", "Coarse language"
  ];

  // Fetch profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // This would be an API call in a real application
        // For now, use mock data
        const mockProfiles = [
          {
            id: 1,
            name: "User 1",
            age: 28,
            photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
            language: "English",
            preferences: {
              contentType: "both",
              genres: ["Action", "Comedy"],
              minAge: 0,
              classifications: ["All ages"]
            }
          },
          {
            id: 2,
            name: "Kids",
            age: 8,
            photoUrl: "https://occ-0-2773-2774.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABTYctxxbe-UkKEdlMxXm4FVGD6DqTHkQ0TQ5CQJ9jbOMnG0CYxYcSICkT-_yUe5wD_KAYoOJVVT0SM-Dh2n24v22Afa8.png",
            language: "English",
            preferences: {
              contentType: "both",
              genres: ["Comedy", "Documentary"],
              minAge: 0,
              classifications: ["All ages", "6 years and over"]
            }
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setProfiles(mockProfiles);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleAddProfile = () => {
    // Validation
    if (!newProfile.name.trim()) {
      alert("Profile name is required");
      return;
    }

    if (profiles.length >= 4) {
      alert("Maximum of 4 profiles per account reached");
      return;
    }

    // Add new profile
    const profileToAdd = {
      ...newProfile,
      id: Date.now(), // Generate a temporary ID
      language: "English", // Default language
    };

    // In a real app, this would be an API call to save the profile
    setProfiles([...profiles, profileToAdd]);
    
    // Reset form and close modal
    setShowAddProfile(false);
    setNewProfile({
      name: "",
      age: 0,
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
      preferences: {
        contentType: "both",
        genres: [],
        minAge: 0,
        classifications: []
      }
    });
  };

  const handleDeleteProfile = (profileId) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      setProfiles(profiles.filter(profile => profile.id !== profileId));
    }
  };

  const handleGenreChange = (genre) => {
    if (newProfile.preferences.genres.includes(genre)) {
      setNewProfile({
        ...newProfile,
        preferences: {
          ...newProfile.preferences,
          genres: newProfile.preferences.genres.filter(g => g !== genre)
        }
      });
    } else {
      setNewProfile({
        ...newProfile,
        preferences: {
          ...newProfile.preferences,
          genres: [...newProfile.preferences.genres, genre]
        }
      });
    }
  };

  const handleClassificationChange = (classification) => {
    if (newProfile.preferences.classifications.includes(classification)) {
      setNewProfile({
        ...newProfile,
        preferences: {
          ...newProfile.preferences,
          classifications: newProfile.preferences.classifications.filter(c => c !== classification)
        }
      });
    } else {
      setNewProfile({
        ...newProfile,
        preferences: {
          ...newProfile.preferences,
          classifications: [...newProfile.preferences.classifications, classification]
        }
      });
    }
  };

  const avatarOptions = [
    "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
    "https://occ-0-2773-2774.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABTYctxxbe-UkKEdlMxXm4FVGD6DqTHkQ0TQ5CQJ9jbOMnG0CYxYcSICkT-_yUe5wD_KAYoOJVVT0SM-Dh2n24v22Afa8.png",
    "https://occ-0-2773-2774.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdYJV5wt63AcxNaDoqDXUhqZb55oN5D5ugMVw4y_LENyQiQmjBZe4CYT6JhSVkXEwpEIr02zQnLJOCY5E16ClYEBW38X.png",
    "https://occ-0-2773-2774.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABWu33TcylnaLZwSdtgKR6mr0O63afqoqnfLJnFLauUmZ_n9B5rU5xzgOD9cBvUZCnKn2jHrxO0_3rHEJGmYuQLBLHc4y.png"
  ];

  return (
    <div className="bg-[#141414] text-white min-h-screen">
      {/* Include Navbar with profile data */}
      <Navbar 
        currentProfile={profiles.length > 0 ? profiles[0] : null} 
        allProfiles={profiles} 
      />

      <div className="pt-28 px-12 pb-12">
        <h1 className="text-3xl font-bold mb-8">Manage Profiles</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {/* Existing profiles */}
            {profiles.map(profile => (
              <div key={profile.id} className="relative group">
                <div className="w-[200px] flex flex-col items-center">
                  <div className="relative">
                    <img 
                    src={profile.photoUrl} 
                    alt={profile.name} 
                    className="w-[140px] h-[140px] rounded-md border-2 border-transparent group-hover:border-white cursor-pointer"
                    onClick={() => navigate('/')}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <svg className="w-10 h-10" fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <span className="mt-3 text-gray-400 group-hover:text-white">{profile.name}</span>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="text-gray-400 hover:text-white mr-3"
                    onClick={() => alert(`Edit functionality for ${profile.name}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-gray-400 hover:text-white"
                    onClick={() => handleDeleteProfile(profile.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add profile button */}
          {profiles.length < 4 && !showAddProfile && (
            <div 
              className="w-[200px] flex flex-col items-center cursor-pointer"
              onClick={() => setShowAddProfile(true)}
            >
              <div className="w-[140px] h-[140px] rounded-md bg-gray-800 flex items-center justify-center border-2 border-transparent hover:border-white">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="mt-3 text-gray-400">Add Profile</span>
            </div>
          )}
        </div>
      )}

      {/* Add Profile Form */}
      {showAddProfile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="bg-[#141414] p-8 rounded-md max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add Profile</h2>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Name</label>
              <input 
                type="text" 
                value={newProfile.name} 
                onChange={(e) => setNewProfile({...newProfile, name: e.target.value})} 
                className="w-full p-3 bg-gray-700 rounded text-white"
                placeholder="Enter name"
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Age</label>
              <input 
                type="number" 
                value={newProfile.age} 
                onChange={(e) => setNewProfile({...newProfile, age: parseInt(e.target.value) || 0})} 
                className="w-full p-3 bg-gray-700 rounded text-white"
                min="0"
                max="100"
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Avatar</label>
              <div className="flex flex-wrap gap-4">
                {avatarOptions.map((avatar, index) => (
                  <div 
                    key={index} 
                    className={`w-20 h-20 cursor-pointer rounded-md ${newProfile.photoUrl === avatar ? 'border-2 border-white' : 'border-2 border-transparent hover:border-gray-500'}`}
                    onClick={() => setNewProfile({...newProfile, photoUrl: avatar})}
                  >
                    <img src={avatar} alt={`Avatar ${index}`} className="w-full h-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Content Preferences</label>
              <div className="flex space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    checked={newProfile.preferences.contentType === "movies"} 
                    onChange={() => setNewProfile({...newProfile, preferences: {...newProfile.preferences, contentType: "movies"}})} 
                    className="form-radio h-5 w-5 text-red-600"
                  />
                  <span className="ml-2">Movies</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    checked={newProfile.preferences.contentType === "series"} 
                    onChange={() => setNewProfile({...newProfile, preferences: {...newProfile.preferences, contentType: "series"}})} 
                    className="form-radio h-5 w-5 text-red-600"
                  />
                  <span className="ml-2">Series</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    checked={newProfile.preferences.contentType === "both"} 
                    onChange={() => setNewProfile({...newProfile, preferences: {...newProfile.preferences, contentType: "both"}})} 
                    className="form-radio h-5 w-5 text-red-600"
                  />
                  <span className="ml-2">Both</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Genres</label>
              <div className="flex flex-wrap gap-2">
                {genreOptions.map((genre) => (
                  <label key={genre} className="inline-flex items-center bg-gray-800 px-3 py-1 rounded-md cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProfile.preferences.genres.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                      className="form-checkbox h-4 w-4 text-red-600"
                    />
                    <span className="ml-2">{genre}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Minimum Age Rating</label>
              <select
                value={newProfile.preferences.minAge}
                onChange={(e) => setNewProfile({...newProfile, preferences: {...newProfile.preferences, minAge: parseInt(e.target.value)}})}
                className="w-full p-3 bg-gray-700 rounded text-white"
              >
                <option value="0">All Ages</option>
                <option value="6">6+</option>
                <option value="9">9+</option>
                <option value="12">12+</option>
                <option value="16">16+</option>
                <option value="18">18+</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Content Classifications</label>
              <div className="flex flex-wrap gap-2">
                {classificationOptions.map((classification) => (
                  <label key={classification} className="inline-flex items-center bg-gray-800 px-3 py-1 rounded-md cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProfile.preferences.classifications.includes(classification)}
                      onChange={() => handleClassificationChange(classification)}
                      className="form-checkbox h-4 w-4 text-red-600"
                    />
                    <span className="ml-2">{classification}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddProfile(false)}
                className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProfile}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!showAddProfile && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Done
          </button>
        </div>
      )}
    </div>
  </div>
);
};

export default ProfileManagement;