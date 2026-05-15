import { useEffect, useMemo, useState } from "react";
import LinkCard from "../components/LinkCard";
import LinkForm from "../components/LinkForm";
import SearchBar from "../components/SearchBar";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://192.168.0.14:8000" || "https://nexspacebackend-b7d3eyc7dfdzfvda.centralindia-01.azurewebsites.net/";

export default function DashboardPage({
  onLogout,
}) {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  const [user, setUser] =
    useState(null);

  const [editingLink, setEditingLink] =
    useState(null);

  // AUTH
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token");

    return {
      "Content-Type":
        "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // LOAD
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLinks();
  }, [
    links,
    searchQuery,
    selectedCategory,
  ]);

  // LOAD DATA
  const loadData = async () => {
    try {
      const [userRes, linksRes] =
        await Promise.all([
          fetch(
            `${BASE_URL}/api/auth/me`,
            {
              headers:
                getAuthHeaders(),
            }
          ),

          fetch(
            `${BASE_URL}/api/links`,
            {
              headers:
                getAuthHeaders(),
            }
          ),
        ]);

      if (
        !userRes.ok ||
        !linksRes.ok
      ) {
        throw new Error(
          "Unauthorized"
        );
      }

      const userData =
        await userRes.json();

      const linksData =
        await linksRes.json();

      setUser(userData);
      setLinks(linksData || []);
    } catch (error) {
      console.error(error);

      localStorage.removeItem(
        "token"
      );

      onLogout();
    } finally {
      setLoading(false);
    }
  };

  // FILTER
  const filterLinks = () => {
    let filtered = [...links];

    if (
      selectedCategory !== "all"
    ) {
      filtered = filtered.filter(
        (link) =>
          link.category ===
          selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query =
        searchQuery.toLowerCase();

      filtered = filtered.filter(
        (link) =>
          link.title
            ?.toLowerCase()
            .includes(query) ||
          link.description
            ?.toLowerCase()
            .includes(query) ||
          link.content
            ?.toLowerCase()
            .includes(query) ||
          link.url
            ?.toLowerCase()
            .includes(query) ||
          link.tags?.some((tag) =>
            tag
              .toLowerCase()
              .includes(query)
          )
      );
    }

    setFilteredLinks(filtered);
  };

  // ADD / UPDATE
  const handleAddLink = async (
    linkData
  ) => {
    try {
      if (
        !linkData.url &&
        !linkData.content &&
        !linkData.description
      ) {
        alert(
          "Please add URL or Notes"
        );

        return;
      }

      // UPDATE
      if (editingLink) {
        const response =
          await fetch(
            `${BASE_URL}/api/links/${editingLink._id}`,
            {
              method: "PUT",
              headers:
                getAuthHeaders(),
              body: JSON.stringify(
                linkData
              ),
            }
          );

        if (!response.ok)
          throw new Error(
            "Update failed"
          );

        const updated =
          await response.json();

        setLinks(
          links.map((l) =>
            l._id ===
            editingLink._id
              ? updated
              : l
          )
        );

        setEditingLink(null);
      }

      // CREATE
      else {
        const response =
          await fetch(
            `${BASE_URL}/api/links`,
            {
              method: "POST",
              headers:
                getAuthHeaders(),
              body: JSON.stringify(
                linkData
              ),
            }
          );

        if (!response.ok)
          throw new Error(
            "Create failed"
          );

        const newLink =
          await response.json();

        setLinks([
          newLink,
          ...links,
        ]);
      }

      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE
  const handleDeleteLink = async (
    id
  ) => {
    try {
      const response =
        await fetch(
          `${BASE_URL}/api/links/${id}`,
          {
            method: "DELETE",
            headers:
              getAuthHeaders(),
          }
        );

      if (!response.ok)
        throw new Error(
          "Delete failed"
        );

      setLinks(
        links.filter(
          (l) => l._id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // EDIT
  const handleEditLink = (
    link
  ) => {
    setEditingLink(link);
    setShowForm(true);
  };

  // CATEGORIES
  const categories = useMemo(() => {
    return Array.from(
      new Set(
        links.map(
          (link) => link.category
        )
      )
    );
  }, [links]);

  // LOADER
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>

            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>

          <p className="text-blue-100 mt-6 text-lg font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-3xl rounded-full"></div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              NexSpace
            </h1>

            <p className="text-gray-400 mt-1">
              Welcome back,{" "}
              <span className="text-white font-semibold">
                {user?.full_name}
              </span>
            </p>
          </div>

          <button
              onClick={() => {
                const confirmLogout = window.confirm(
                  "Are you sure you want to logout?"
                );

                if (confirmLogout) {
                  localStorage.removeItem("token");
                  onLogout();
                }
              }}
              className="px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold shadow-lg hover:scale-105"
            >
              Logout
            </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-10 bg-[#0a0a0a] min-h-screen">
        {/* TOP BAR */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-5 justify-between mb-10">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={
                setSearchQuery
              }
              placeholder="Search links, notes, tags..."
            />
          </div>

          <button
            onClick={() => {
              setEditingLink(null);
              setShowForm(true);
            }}
            className="group relative overflow-hidden px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">
              + Add New
            </span>

            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition"></div>
          </button>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() =>
              setSelectedCategory(
                "all"
              )
            }
            className={`px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
              selectedCategory ===
              "all"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(
                  cat
                )
              }
              className={`px-5 py-2.5 rounded-2xl capitalize font-semibold transition-all duration-300 ${
                selectedCategory ===
                cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MODAL */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#0b1120] shadow-[0_0_80px_rgba(59,130,246,0.2)] overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                <div>
                  <h2 className="text-3xl font-bold">
                    {editingLink
                      ? "Edit Item"
                      : "Create New"}
                  </h2>

                  <p className="text-gray-400 mt-1">
                    Add notes or URLs
                    and generate QR
                    instantly
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingLink(null);
                  }}
                  className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500 transition-all duration-300 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <LinkForm
                  onSubmit={
                    handleAddLink
                  }
                  initialData={
                    editingLink ||
                    undefined
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {filteredLinks.length ===
        0 ? (
          <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-[40px] p-20 text-center">
            <div className="text-8xl mb-6">
              🚀
            </div>

            <h2 className="text-4xl font-black mb-4">
              No Items Found
            </h2>

            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Add links, notes, QR
              content and organize
              everything beautifully
              in one place.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
            {filteredLinks.map(
              (link) => (
                <div
                  key={link._id}
                  className="transform transition-all duration-300 hover:-translate-y-2"
                >
                  <LinkCard
                    link={link}
                    onEdit={
                      handleEditLink
                    }
                    onDelete={
                      handleDeleteLink
                    }
                  />
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}