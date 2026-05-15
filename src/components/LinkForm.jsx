import { useState } from "react";

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#6B7280",
];

const CATEGORIES = [
  "work",
  "learning",
  "entertainment",
  "tools",
  "inspiration",
  "youtube",
  "general",
];

export default function LinkForm({
  onSubmit,
  initialData,
}) {
  const [formData, setFormData] =
    useState({
      // TYPE
      type:
        initialData?.type ||
        (initialData?.url
          ? "link"
          : "note"),

      // COMMON
      title:
        initialData?.title || "",

      description:
        initialData?.description ||
        "",

      category:
        initialData?.category ||
        "general",

      color:
        initialData?.color ||
        "#3B82F6",

      tags:
        initialData?.tags || [],

      // LINK
      url:
        initialData?.url || "",

      // NOTES
      content:
        initialData?.content ||
        initialData?.description ||
        "",
    });

  const [tagInput, setTagInput] =
    useState("");

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ADD TAG
  const handleAddTag = () => {
    const cleaned =
      tagInput.trim();

    if (
      cleaned &&
      !formData.tags.includes(
        cleaned
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [
          ...prev.tags,
          cleaned,
        ],
      }));

      setTagInput("");
    }
  };

  // REMOVE TAG
  const handleRemoveTag = (
    tag
  ) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(
        (t) => t !== tag
      ),
    }));
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    // TITLE
    if (
      !formData.title.trim()
    ) {
      alert("Title is required");

      return;
    }

    // LINK VALIDATION
    if (
      formData.type ===
        "link" &&
      !formData.url.trim()
    ) {
      alert("URL is required");

      return;
    }

    // NOTES VALIDATION
    if (
      formData.type ===
        "note" &&
      !formData.content.trim()
    ) {
      alert(
        "Notes are required"
      );

      return;
    }

    // FINAL PAYLOAD
    const payload = {
      title:
        formData.title,

      url:
        formData.type ===
        "link"
          ? formData.url
          : "",

      description:
        formData.type ===
        "note"
          ? formData.content
          : formData.description,

      content:
        formData.type ===
        "note"
          ? formData.content
          : "",

      category:
        formData.category,

      color:
        formData.color,

      tags: formData.tags,

      type: formData.type,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* TYPE */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Type
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* LINK */}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                type: "link",
              }))
            }
            className={`py-3 rounded-2xl border font-semibold transition-all ${
              formData.type ===
              "link"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
          >
            🔗 Link
          </button>

          {/* NOTE */}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                type: "note",
              }))
            }
            className={`py-3 rounded-2xl border font-semibold transition-all ${
              formData.type ===
              "note"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
          >
            📝 Notes
          </button>
        </div>
      </div>

      {/* TITLE */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Title *
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={
            formData.type ===
            "link"
              ? "e.g. React Documentation"
              : "e.g. RAG Interview Notes"
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      {/* URL */}
      {formData.type ===
        "link" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL *
          </label>

          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={
              handleChange
            }
            placeholder="https://example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      )}

      {/* NOTES */}
      {formData.type ===
        "note" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Important Notes *
          </label>

          <textarea
            name="content"
            value={
              formData.content
            }
            onChange={
              handleChange
            }
            rows={8}
            placeholder="Write your important notes here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
          />
        </div>
      )}

      {/* DESCRIPTION */}
      {formData.type ===
        "link" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            rows={3}
            placeholder="Short description..."
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
          />
        </div>
      )}

      {/* CATEGORY */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Category
        </label>

        <select
          name="category"
          value={
            formData.category ||
            ""
          }
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
        >
          {/* PLACEHOLDER */}
          <option
            value=""
            disabled
            className="text-gray-400"
          >
            Select Category
          </option>

          {CATEGORIES.map(
            (cat) => (
              <option
                key={cat}
                value={cat}
                className="text-gray-900"
              >
                {cat.charAt(0).toUpperCase() +
                  cat.slice(1)}
              </option>
            )
          )}
        </select>
      </div>

      {/* COLORS */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Color
        </label>

        <div className="flex flex-wrap gap-3">
          {COLORS.map(
            (color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      color,
                    })
                  )
                }
                className={`w-10 h-10 rounded-2xl border-2 transition-all ${
                  formData.color ===
                  color
                    ? "border-black scale-110 shadow-md"
                    : "border-gray-300"
                }`}
                style={{
                  backgroundColor:
                    color,
                }}
              />
            )
          )}
        </div>
      </div>

      {/* TAGS */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tags
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) =>
              setTagInput(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key ===
                "Enter"
              ) {
                e.preventDefault();

                handleAddTag();
              }
            }}
            placeholder="Add tag..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <button
            type="button"
            onClick={
              handleAddTag
            }
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition"
          >
            Add
          </button>
        </div>

        {/* TAG LIST */}
        {formData.tags.length >
          0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.tags.map(
              (tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full"
                >
                  #{tag}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveTag(
                        tag
                      )
                    }
                    className="hover:text-red-600 transition"
                  >
                    ×
                  </button>
                </span>
              )
            )}
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition shadow-md"
        >
          {initialData
            ? "Update"
            : formData.type ===
              "link"
            ? "Add Link"
            : "Add Notes"}
        </button>
      </div>
    </form>
  );
}