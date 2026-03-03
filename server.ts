app.delete("/api/listings/:id", requireAuth, async (req, res) => {
  const uid = req.user!.uid;
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid listing id" });
  }

  try {
    // Load listing row: seller_uid, photos, video_url
    const listing = db
      .prepare("SELECT id, seller_uid, photos, video_url FROM listings WHERE id = ?")
      .get(id) as { id: number; seller_uid: string; photos?: string | null; video_url?: string | null } | undefined;

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Ownership check (keep exactly as before)
    if (listing.seller_uid !== uid) {
      return res.status(403).json({ error: "Forbidden: not your listing" });
    }

    // Parse photos JSON safely + add video_url if present
    const mediaUrls: string[] = [];
    try {
      const arr = JSON.parse(listing.photos || "[]");
      if (Array.isArray(arr)) {
        mediaUrls.push(...arr.filter((x) => typeof x === "string"));
      }
    } catch (e) {
      console.warn("Failed to parse photos JSON for listing", id, e);
    }

    if (listing.video_url && typeof listing.video_url === "string" && listing.video_url.trim().length > 0) {
      mediaUrls.push(listing.video_url);
    }

    // Convert URLs to public_ids using existing cloudinaryPublicIdFromUrl helper
    const publicIds = Array.from(
      new Set(
        mediaUrls
          .map((u) => (typeof u === "string" ? cloudinaryPublicIdFromUrl(u) : null))
          .filter((x): x is string => Boolean(x))
      )
    );

    // Delete each public_id as both image and video resource_type (best-effort)
    const cloudinaryResults: any[] = [];
    for (const pid of publicIds) {
      try {
        const rImg = await cloudinary.uploader.destroy(pid, { resource_type: "image" });
        cloudinaryResults.push({ public_id: pid, type: "image", result: rImg });
      } catch (e: any) {
        cloudinaryResults.push({ public_id: pid, type: "image", error: e?.message || String(e) });
      }

      try {
        const rVid = await cloudinary.uploader.destroy(pid, { resource_type: "video" });
        cloudinaryResults.push({ public_id: pid, type: "video", result: rVid });
      } catch (e: any) {
        cloudinaryResults.push({ public_id: pid, type: "video", error: e?.message || String(e) });
      }
    }

    // Delete reports for that listing id (optional) then delete the listing row
    try {
      db.prepare("DELETE FROM reports WHERE listing_id = ?").run(id);
    } catch (e) {
      console.warn("Failed to delete reports for listing", id, e);
    }

    db.prepare("DELETE FROM listings WHERE id = ?").run(id);

    return res.json({ success: true, cloudinaryResults });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Failed to delete listing" });
  }
});
