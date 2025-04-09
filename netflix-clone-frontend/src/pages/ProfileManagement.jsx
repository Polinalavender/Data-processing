import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const ProfileManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(null);
  const [newProfile, setNewProfile] = useState({
    name: "",
    age: '',
    photoUrl: "",
    imageFile: null,
    preferences: {
      contentType: "both",
      genres: [],
      minAge: '',
      classifications: [],
    },
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const genreOptions = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Romance",
    "Thriller",
    "Documentary",
  ];

  const classificationOptions = [
    "All ages",
    "6 years and over",
    "9 years and over",
    "12 years and over",
    "16 years and over",
    "Violence",
    "Sex",
    "Terror",
    "Discrimination",
    "Drug and alcohol abuse",
    "Coarse language",
  ];

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/profiles/${user.id}`);
        setProfiles(res.data || []);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user.id]);

  const handleUpload = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "netflix_profiles");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dinmtcy0m/image/upload",
      formData
    );
    return res.data.secure_url;
  };

  const resetProfileState = () => {
    setNewProfile({
      name: "",
      age: 0,
      photoUrl: "",
      imageFile: null,
      preferences: {
        contentType: "both",
        genres: [],
        minAge: 0,
        classifications: [],
      },
    });
    setShowAddProfile(false);
    setEditProfile(null);
  };

  const handleSave = async () => {
    try {
      const photoUrl = newProfile.imageFile
        ? await handleUpload(newProfile.imageFile)
        : newProfile.photoUrl;

      const payload = {
        ...newProfile,
        userId: user.id,
        photoUrl,
        preferences: JSON.stringify(newProfile.preferences),
      };

      if (editProfile) {
        await axios.put(
          `${API_BASE_URL}/api/profiles/${editProfile.profileId}`,
          payload
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/profiles`, payload);
      }

      const res = await axios.get(`${API_BASE_URL}/api/profiles/${user.id}`);
      setProfiles(res.data);
      resetProfileState();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleDeleteProfile = async (id) => {
    if (window.confirm("Delete this profile?")) {
      await axios.delete(`${API_BASE_URL}/api/profiles/${id}`);
      setProfiles((prev) => prev.filter((p) => p.profileId !== id));
    }
  };

  const handleEdit = (profile) => {
    setNewProfile({
      ...profile,
      imageFile: null,
      preferences:
        typeof profile.preferences === "string"
          ? JSON.parse(profile.preferences)
          : profile.preferences,
    });
    setEditProfile(profile);
    setShowAddProfile(true);
  };

  const handleGenreChange = (genre) => {
    const genres = newProfile.preferences.genres.includes(genre)
      ? newProfile.preferences.genres.filter((g) => g !== genre)
      : [...newProfile.preferences.genres, genre];
    setNewProfile({
      ...newProfile,
      preferences: { ...newProfile.preferences, genres },
    });
  };

  const handleClassificationChange = (classification) => {
    const classifications = newProfile.preferences.classifications.includes(
      classification
    )
      ? newProfile.preferences.classifications.filter(
          (c) => c !== classification
        )
      : [...newProfile.preferences.classifications, classification];
    setNewProfile({
      ...newProfile,
      preferences: { ...newProfile.preferences, classifications },
    });
  };

  const handleAgeChange = (e) => {
    const age = e.target.value;
    if (/^\d+$/.test(age) && parseInt(age) >= 0) {
      setNewProfile({ ...newProfile, age: parseInt(age) });
    } else {
      setNewProfile({ ...newProfile, age: 0 });
    }
  };  

  return (
    <div className="bg-[#141414] text-white min-h-screen">
      <Navbar currentProfile={profiles[0] || null} allProfiles={profiles} />
      <div className="pt-28 px-12 pb-12">
        <h1 className="text-3xl font-bold mb-8">Manage Profiles</h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {profiles.map((profile) => (
              <div key={profile.profileId} className="relative group">
                <div className="w-[200px] flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="w-[140px] h-[140px] rounded-md border-2 border-transparent group-hover:border-white cursor-pointer"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <span className="mt-3 text-gray-400 group-hover:text-white">
                    {profile.name}
                  </span>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="text-gray-400 hover:text-white mr-3"
                      onClick={() => handleEdit(profile)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={() => handleDeleteProfile(profile.profileId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {profiles.length < 4 && !showAddProfile && (
              <div
                className="w-[200px] flex flex-col items-center cursor-pointer"
                onClick={() => setShowAddProfile(true)}
              >
                <div className="w-[140px] h-[140px] rounded-md bg-gray-800 flex items-center justify-center border-2 border-transparent hover:border-white">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="mt-3 text-gray-400">Add Profile</span>
              </div>
            )}
          </div>
        )}

        {showAddProfile && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20">
            <div className="bg-[#141414] p-8 rounded-md max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editProfile ? "Edit" : "Add"} Profile
              </h2>

              <div className="mb-6">
                <label className="block mb-2 text-gray-300">Name</label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, name: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700 rounded text-white"
                  placeholder="Enter name"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-gray-300">Age</label>
                <input
                  type="text"
                  value={newProfile.age}
                  onChange={handleAgeChange}
                  className="w-full p-3 bg-gray-700 rounded text-white"
                  placeholder="Enter age"
                />
              </div>

              <div className="mb-6"> {/* Profile picture upload */}
                <label className="block mb-2 text-gray-300">
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewProfile({
                      ...newProfile,
                      imageFile: e.target.files[0],
                    })
                  }
                  className="text-white"
                />
              </div>
 
              <div className="mb-6"> {/* Genres */}
                <label className="block mb-2 text-gray-300">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genreOptions.map((genre) => (
                    <label
                      key={genre}
                      className="inline-flex items-center bg-gray-800 px-3 py-1 rounded-md cursor-pointer"
                    >
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

              {/* Classifications */}
              <div className="mb-6">
                <label className="block mb-2 text-gray-300">
                  Content Classifications
                </label>
                <div className="flex flex-wrap gap-2">
                  {classificationOptions.map((classification) => (
                    <label
                      key={classification}
                      className="inline-flex items-center bg-gray-800 px-3 py-1 rounded-md cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newProfile.preferences.classifications.includes(
                          classification
                        )}
                        onChange={() =>
                          handleClassificationChange(classification)
                        }
                        className="form-checkbox h-4 w-4 text-red-600"
                      />
                      <span className="ml-2">{classification}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={resetProfileState}
                  className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileManagement;
