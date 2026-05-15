import { useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function LinkCard({
  link,
  onEdit,
  onDelete,
}) {
  const [showMenu, setShowMenu] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [showQR, setShowQR] =
    useState(false);

  const [showNotes, setShowNotes] =
    useState(false);

  const [fullscreenNotes, setFullscreenNotes] =
    useState(false);

  // SAFE URL CHECK
  const hasUrl =
    link.url &&
    link.url.trim() !== "";

  // SAFE COPY VALUE
  const qrValue = hasUrl
    ? String(link.url || "").trim()
    : String(
        link.description || ""
      ).trim();

  // QR LIMIT
  const MAX_QR_LENGTH = 1500;

  const isQRTooLarge =
    qrValue.length > MAX_QR_LENGTH;

  // COPY FUNCTION
  const handleCopy = async () => {
    try {
      const textToCopy =
        qrValue.length > 50000
          ? qrValue.slice(0, 50000)
          : qrValue;

      // MODERN CLIPBOARD API
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          textToCopy
        );
      } else {
        // FALLBACK METHOD
        const textArea =
          document.createElement(
            "textarea"
          );

        textArea.value = textToCopy;

        textArea.style.position =
          "fixed";

        textArea.style.left =
          "-999999px";

        textArea.style.top =
          "-999999px";

        document.body.appendChild(
          textArea
        );

        textArea.focus();
        textArea.select();

        document.execCommand(
          "copy"
        );

        textArea.remove();
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );

      alert(
        "Failed to copy text."
      );
    }
  };

  // DELETE
  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this item?"
      )
    ) {
      onDelete(link._id);
    }
  };

  // DOMAIN
  const getDomain = (url) => {
    if (
      !url ||
      url.trim() === ""
    ) {
      return "Notes";
    }

    try {
      return new URL(url)
        .hostname;
    } catch {
      return "Notes";
    }
  };

  return (
    <>
      {/* CARD */}
      <div
        className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative h-full flex flex-col"
        style={{
          borderTop: `5px solid ${link.color}`,
        }}
      >
        {/* BODY */}
        <div className="p-6 flex flex-col flex-1">

          {/* HEADER */}
          <div className="flex justify-between items-start gap-3">

            {/* TITLE */}
            <h3 className="text-xl font-bold text-gray-900 break-words line-clamp-2 flex-1">
              {link.title}
            </h3>

            {/* MENU */}
            <div className="relative shrink-0">

              <button
                onClick={() =>
                  setShowMenu(!showMenu)
                }
                className="p-2 rounded-xl hover:bg-gray-100 transition"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>

              {/* DROPDOWN */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-200 z-30 overflow-hidden">

                  {/* EDIT */}
                  <button
                    onClick={() => {
                      onEdit(link);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-green-700 hover:bg-green-50 transition font-semibold"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition font-semibold"
                  >
                    Delete
                  </button>

                  {/* QR */}
                  <button
                    onClick={() => {
                      setShowQR(!showQR);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-blue-600 hover:bg-gray-100 transition font-semibold"
                  >
                    {showQR
                      ? "Hide QR"
                      : "Show QR"}
                  </button>

                </div>
              )}
            </div>
          </div>

          {/* DOMAIN + COPY */}
          <div className="flex items-center gap-2 mt-2">

            <span className="text-sm text-gray-500 truncate">
              {getDomain(link.url)}
            </span>

            {/* COPY BUTTON */}
            <button
              onClick={handleCopy}
              className="ml-auto shrink-0 p-2 rounded-xl hover:bg-gray-100 transition flex items-center justify-center min-w-[42px] h-[42px]"
            >
              {copied ? (
                <span className="text-green-600 text-sm font-semibold">
                  Copied
                </span>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* NOTES SECTION */}
          {!hasUrl &&
            link.description && (
              <div className="mt-5">

                {/* NOTES BUTTON */}
                <button
                  onClick={() =>
                    setShowNotes(
                      !showNotes
                    )
                  }
                  className="w-full flex items-center justify-between px-4 py-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                      📝
                    </div>

                    <div className="text-left">
                      <p className="font-semibold text-blue-900">
                        Click to View Notes
                      </p>

                      <p className="text-sm text-blue-600">
                        Expand note content
                      </p>
                    </div>
                  </div>

                  <div
                    className={`transition-transform duration-300 ${
                      showNotes
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </div>
                </button>

                {/* SMALL PREVIEW */}
                {showNotes && (
                  <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-5">

                    <div className="max-h-[300px] overflow-y-auto">

                      <p className="text-gray-700 whitespace-pre-wrap break-words leading-7 text-sm">
                        {
                          link.description
                        }
                      </p>

                    </div>

                    {/* FULLSCREEN BUTTON */}
                    <button
                      onClick={() =>
                        setFullscreenNotes(
                          true
                        )
                      }
                      className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-[1.02] transition-all duration-300"
                    >
                      Open Full Screen
                    </button>

                  </div>
                )}
              </div>
            )}

          {/* CATEGORY */}
          <div className="mt-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold capitalize">
              {link.category}
            </span>
          </div>

          {/* TAGS */}
          {link.tags?.length >
            0 && (
            <div className="flex flex-wrap gap-2 mt-5">

              {link.tags
                .slice(0, 4)
                .map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}

            </div>
          )}

          {/* QR SECTION */}
          {showQR && (
            <div className="mt-6 border-t border-gray-200 pt-5">

              <div className="flex flex-col items-center">

                {!isQRTooLarge ? (
                  <>
                    <div className="bg-white p-4 rounded-3xl border shadow-sm">

                      <QRCodeCanvas
                        value={qrValue}
                        size={140}
                        includeMargin
                        level="L"
                      />

                    </div>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Scan QR to open link or notes
                    </p>
                  </>
                ) : (
                  <div className="w-full rounded-3xl border border-red-200 bg-red-50 p-6 text-center">

                    <div className="text-4xl mb-3">
                      ⚠️
                    </div>

                    <h3 className="text-lg font-bold text-red-600">
                      QR Not Available
                    </h3>

                    <p className="text-sm text-red-500 mt-2 leading-6">
                      Too much information to generate a QR code.
                    </p>

                    <p className="text-xs text-gray-500 mt-3">
                      Try shortening the notes or use a share link instead.
                    </p>

                  </div>
                )}

              </div>
            </div>
          )}

          {/* LINK BUTTON */}
          {hasUrl && (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block w-full group relative overflow-hidden px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center font-bold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Visit Link →
            </a>
          )}

        </div>
      </div>

      {/* TRUE FULLSCREEN MODAL */}
      {fullscreenNotes &&
        createPortal(
          <div className="fixed inset-0 z-[999999] bg-white">

            {/* FULLSCREEN WRAPPER */}
            <div className="w-screen h-screen flex flex-col">

              {/* TOP BAR */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm shrink-0">

                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 truncate">
                    {link.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Full Screen Notes
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  {/* COPY */}
                  <button
                    onClick={handleCopy}
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Copy
                  </button>

                  {/* CLOSE */}
                  <button
                    onClick={() =>
                      setFullscreenNotes(
                        false
                      )
                    }
                    className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 flex items-center justify-center transition"
                  >
                    ✕
                  </button>

                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto bg-gray-50">

                <div className="min-h-full w-full px-8 py-8">

                  <pre className="whitespace-pre-wrap break-words text-gray-800 leading-8 text-[16px] font-sans">
                    {link.description}
                  </pre>

                </div>

              </div>

            </div>

          </div>,
          document.body
        )}
    </>
  );
}