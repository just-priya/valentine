import React, { useState, useEffect, useRef } from "react";
import { config as defaultConfig } from "./config";
import "./SettingsPanel.css";

const MAX_IMAGE_DIM = 800;
const JPEG_QUALITY = 0.82;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > MAX_IMAGE_DIM || height > MAX_IMAGE_DIM) {
          if (width > height) {
            height = (height / width) * MAX_IMAGE_DIM;
            width = MAX_IMAGE_DIM;
          } else {
            width = (width / height) * MAX_IMAGE_DIM;
            height = MAX_IMAGE_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function SettingsPanel({ isOpen, onClose, config, onSave, onReset }) {
  const [form, setForm] = useState({ ...config });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setForm({ ...config });
  }, [isOpen, config]);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateArray = (key, index, value) =>
    setForm((prev) => {
      const arr = [...(prev[key] || [])];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });

  const addArrayItem = (key, defaultValue = "") =>
    setForm((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), defaultValue],
    }));

  const removeArrayItem = (key, index) =>
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== index),
    }));

  const handleSave = () => {
    try {
      onSave(form);
      onClose();
    } catch (e) {
      if (e?.message === "STORAGE_FULL") {
        alert("Storage full. Try fewer photos or use smaller images.");
      }
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all customizations to default?")) {
      onReset();
      setForm({ ...defaultConfig });
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const newPhotos = [];
      const newCaptions = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        const dataUrl = await fileToDataUrl(file);
        newPhotos.push(dataUrl);
        newCaptions.push("");
      }
      setForm((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...newPhotos],
        photoCaptions: [...(prev.photoCaptions || []), ...newCaptions],
      }));
    } catch (err) {
      console.error(err);
      alert("Could not process images. Try smaller files.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const isUploadedPhoto = (photo) => typeof photo === "string" && photo.startsWith("data:");

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">⚙️ Customize your Valentine</h2>
          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="settings-body">
          {/* Personal */}
          <section className="settings-section">
            <h3>Personal</h3>
            <label>
              <span>Recipient name</span>
              <input
                type="text"
                value={form.recipientName || ""}
                onChange={(e) => update("recipientName", e.target.value)}
                placeholder="e.g. Sairam"
              />
            </label>
            <label>
              <span>Landing subtitle</span>
              <input
                type="text"
                value={form.landingSubtitle || ""}
                onChange={(e) => update("landingSubtitle", e.target.value)}
              />
            </label>
            <label>
              <span>Letter intro</span>
              <input
                type="text"
                value={form.letterIntro || ""}
                onChange={(e) => update("letterIntro", e.target.value)}
              />
            </label>
          </section>

          {/* Messages */}
          <section className="settings-section">
            <h3>Messages</h3>
            <label>
              <span>Success message</span>
              <textarea
                value={form.successMainMessage || ""}
                onChange={(e) => update("successMainMessage", e.target.value)}
                rows={2}
              />
            </label>
            <label>
              <span>Valentine message</span>
              <textarea
                value={form.valentineMessage || ""}
                onChange={(e) => update("valentineMessage", e.target.value)}
                rows={2}
              />
            </label>
            <label>
              <span>Sign-off (e.g. — Your partner)</span>
              <input
                type="text"
                value={form.footerSignOff || ""}
                onChange={(e) => update("footerSignOff", e.target.value)}
              />
            </label>
          </section>

          {/* Letter lines */}
          <section className="settings-section">
            <h3>Letter lines</h3>
            <p className="settings-hint">Each line appears one by one in the letter.</p>
            {(form.letterLines || []).map((line, i) => (
              <label key={i} className="settings-array-row">
                <span>Line {i + 1}</span>
                <div className="settings-array-input">
                  <textarea
                    value={line}
                    onChange={(e) => updateArray("letterLines", i, e.target.value)}
                    rows={2}
                  />
                  <button
                    type="button"
                    className="settings-remove"
                    onClick={() => removeArrayItem("letterLines", i)}
                    aria-label="Remove"
                  >
                    −
                  </button>
                </div>
              </label>
            ))}
            <button
              type="button"
              className="settings-add"
              onClick={() => addArrayItem("letterLines", "")}
            >
              + Add line
            </button>
          </section>

          {/* Reasons */}
          <section className="settings-section">
            <h3>Reasons I love you</h3>
            <p className="settings-hint">One per carousel slide.</p>
            {(form.reasons || []).map((r, i) => (
              <label key={i} className="settings-array-row">
                <span>Reason {i + 1}</span>
                <div className="settings-array-input">
                  <input
                    type="text"
                    value={r}
                    onChange={(e) => updateArray("reasons", i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="settings-remove"
                    onClick={() => removeArrayItem("reasons", i)}
                    aria-label="Remove"
                  >
                    −
                  </button>
                </div>
              </label>
            ))}
            <button
              type="button"
              className="settings-add"
              onClick={() => addArrayItem("reasons", "")}
            >
              + Add reason
            </button>
          </section>

          {/* Photos & captions */}
          <section className="settings-section">
            <h3>Photos & captions</h3>
            <p className="settings-hint">
              Upload images from your device or add filenames (place files in public/photos/).
            </p>
            <label className="settings-upload-btn">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading ? "Uploading…" : "📁 Upload images from drive"}
            </label>
            {(form.photos || []).map((_, i) => (
              <div key={i} className="settings-photo-row">
                {isUploadedPhoto(form.photos[i]) ? (
                  <label className="settings-photo-preview">
                    <span>Photo {i + 1} (uploaded)</span>
                    <img src={form.photos[i]} alt={`Preview ${i + 1}`} />
                  </label>
                ) : (
                  <label>
                    <span>Photo {i + 1} filename</span>
                    <input
                      type="text"
                      value={form.photos[i] || ""}
                      onChange={(e) => updateArray("photos", i, e.target.value)}
                      placeholder="e.g. 1.jpeg"
                    />
                  </label>
                )}
                <label>
                  <span>Caption</span>
                  <input
                    type="text"
                    value={(form.photoCaptions || [])[i] || ""}
                    onChange={(e) => {
                      const captions = [...(form.photoCaptions || [])];
                      captions[i] = e.target.value;
                      setForm((prev) => ({ ...prev, photoCaptions: captions }));
                    }}
                    placeholder="Caption for this photo"
                  />
                </label>
                <button
                  type="button"
                  className="settings-remove settings-remove-photo"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      photos: (prev.photos || []).filter((_, j) => j !== i),
                      photoCaptions: (prev.photoCaptions || []).filter((_, j) => j !== i),
                    }))
                  }
                  aria-label="Remove photo"
                >
                  −
                </button>
              </div>
            ))}
            <button
              type="button"
              className="settings-add"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  photos: [...(prev.photos || []), ""],
                  photoCaptions: [...(prev.photoCaptions || []), ""],
                }))
              }
            >
              + Add photo
            </button>
          </section>
        </div>

        <div className="settings-footer">
          <button type="button" className="settings-reset" onClick={handleReset}>
            Reset to default
          </button>
          <button type="button" className="settings-save cta-button primary" onClick={handleSave}>
            Save & close
          </button>
        </div>
      </div>
    </div>
  );
}
