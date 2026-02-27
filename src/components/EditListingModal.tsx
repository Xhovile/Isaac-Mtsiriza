import { useEffect, useState } from "react";
import { Listing } from "../types";

export default function EditListingModal({
  listing,
  onClose,
  onSave,
}: {
  listing: Listing;
  onClose: () => void;
  onSave: (updated: Partial<Listing>) => void;
}) {
  const [form, setForm] = useState({
    name: listing.name || "",
    price: String(listing.price ?? ""),
    description: listing.description || "",
    category: listing.category || "",
    university: listing.university || "",
    whatsapp_number: listing.whatsapp_number || "",
  });

  useEffect(() => {
    // If user clicks Edit on another listing without closing, sync the form.
    setForm({
      name: listing.name || "",
      price: String(listing.price ?? ""),
      description: listing.description || "",
      category: listing.category || "",
      university: listing.university || "",
      whatsapp_number: listing.whatsapp_number || "",
    });
  }, [listing]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999 }}>
      <div style={{ maxWidth: 560, margin: "8% auto", background: "#fff", padding: 18, borderRadius: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontWeight: 800 }}>Edit Listing</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
          />

          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
          />

          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={3}
          />

          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Category"
          />

          <input
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
            placeholder="University"
          />

          <input
            value={form.whatsapp_number}
            onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
            placeholder="WhatsApp number"
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>

          <button
            onClick={() => {
              const priceNum = Number(form.price);
              if (Number.isNaN(priceNum)) {
                alert("Price must be a number");
                return;
              }
              onSave({
                name: form.name,
                price: priceNum,
                description: form.description,
                category: form.category,
                university: form.university,
                whatsapp_number: form.whatsapp_number,
                // photos are not edited here; we keep existing photos in App.tsx
              });
            }}
            style={{ flex: 1, fontWeight: 800 }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
            }
