app.post(["/api/upload", "/api/upload/"], async (req, res) => {
    if (!req.file) {
        const mime = req.file.mimetype || "";
        const isAllowed = mime.startsWith("image/") || mime.startsWith("video/");
        if (!isAllowed) {
            return res.status(400).json({ error: "Unsupported file type" });
        }
        // existing logic...
    }
    const b64 = ...; // continue with existing logic for b64/dataURI
});