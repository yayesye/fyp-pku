import { useRef, useState } from "react";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export default function ImgBBUploadButton({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file); // ← send the file directly, not base64

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("ImgBB response:", data); // keep this for debugging

      if (!data.success) {
        throw new Error(data.error?.message || "Upload failed");
      }

      const url = data.data.url;
      const name = file.name;
      setImageUrl(url);
      if (onUpload) onUpload({ url, name });

    } catch (err) {
      console.error("ImgBB upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      {imageUrl && (
        <div className="max-h-60 rounded-lg overflow-hidden border border-gray-200 relative">
          <img src={imageUrl} alt="Uploaded" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => { setImageUrl(null); if (onUpload) onUpload({ url: null, name: null }); }}
            className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 text-xs cursor-pointer"
          >
            <i className="fa-solid fa-x"></i>
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="bg-inherit hover:text-white cursor-pointer px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 text-sm rounded-lg transition-opacity flex items-center gap-2"
      >
        {uploading ? "Uploading..." : (
          <>Upload Image <svg className="stroke-primary-yellow" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6 7L11 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg></>
        )}
      </button>
    </div>
  );
}