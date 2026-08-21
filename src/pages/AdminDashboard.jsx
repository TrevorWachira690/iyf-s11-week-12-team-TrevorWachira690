import React, { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SEO from "../components/SEO.jsx";

const CATEGORIES = [
  "Electronics",
  "Web Development",
  "Data Analysis",
  "Clothing Shopping",
  "Design",
  "Marketing",
  "Writing",
  "Photography",
  "Music",
  "Video",
  "Other",
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await api.getPosts();
        const allListings = data.listings || data.posts || [];
        const mine = allListings.filter(
          (l) => l.author?._id === user?._id || l.author === user?._id,
        );
        setListings(mine);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchListings();
    }
  }, [user]);

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    // Validate each file size
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Image is too large. Please use photos under 5MB each.");
        return;
      }
    }

    // Update state with new files
    setImageFiles((prevFiles) => {
      // Remove duplicates (by name) and add new files
      const existingNames = new Set(prevFiles.map((f) => f.name));
      const newFiles = files.filter((file) => !existingNames.has(file.name));
      return [...prevFiles, ...newFiles];
    });

    // Generate previews for new files
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
        // Update formData with all images (existing + new)
        setFormData((prev) => ({
          ...prev,
          images: [...new Set([...(prev.images || []), reader.result])], // Remove duplicates
        }));
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleCreateListing(e) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await api.createPost({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        image: formData.image, // Keep for backward compatibility
        images: formData.images || [], // Send images array
      });
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        images: [],
      });
      setImageFiles([]);
      setImagePreviews([]);
      const data = await api.getPosts();
      const allListings = data.listings || data.posts || [];
      const mine = allListings.filter(
        (l) => l.author?._id === user?._id || l.author === user?._id,
      );
      setListings(mine);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(listingId) {
    try {
      await api.deletePost(listingId);
      setListings((prev) => prev.filter((l) => l._id !== listingId));
    } catch (err) {
      console.error("Failed to delete listing:", err);
    }
    setDeleteTarget(null);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="text-center py-8 text-gray-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="TBM-DeepIn - My Listings"
        description="Manage your marketplace listings"
      />

      <div className="max-w-2xl mx-auto p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Listings</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
          >
            {showCreateForm ? "Cancel" : "+ New Listing"}
          </button>
        </div>

        {/* Create Listing Form */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateListing}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 space-y-3"
          >
            <h2 className="text-lg font-semibold">Create New Listing</h2>
            {formError && <p className="text-red-600 text-sm">{formError}</p>}
            <input
              type="text"
              placeholder="Listing title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              min={0}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Images (up to 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Product preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreviews((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 disabled:opacity-50"
            >
              {formLoading ? "Creating..." : "Create Listing"}
            </button>
          </form>
        )}

        {listings.length === 0 ? (
          <EmptyState
            title="No listings yet"
            message="Create your first marketplace listing!"
          />
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {listing.title}
                  </h3>
                  <StatusBadge status={listing.status} />
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                  {listing.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">
                    ${listing.price?.toLocaleString()}
                  </span>
                  <span>{listing.category}</span>
                </div>

                <div className="flex gap-3 mt-4">
                  <a
                    href={`https://wa.me/?text=Hi${encodeURIComponent(listing.author?.name || "")},%20I%20saw%20your%20listing%20"${listing.title}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 text-sm hover:underline"
                  >
                    Contact Owner
                  </a>
                  <button
                    onClick={() => setDeleteTarget(listing)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          isOpen={!!deleteTarget}
          message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
          onConfirm={() => deleteTarget && handleDelete(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </>
  );
}
