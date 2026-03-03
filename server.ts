import { Request, Response } from 'express';
import db from './db'; // Assuming you have a db file to handle DB queries

// ... other routes ...

// POST /api/listings
app.post('/api/listings', async (req: Request, res: Response) => {
    const sellerId = req.body.sellerId; // Replace with actual way to get seller ID from request

    const seller = await db.query('SELECT is_verified FROM sellers WHERE uid = ?;', [sellerId]);

    if (seller.length === 0) {
        return res.status(404).send('Seller not found');
    }

    if (seller[0].is_verified !== 1) {
        return res.status(403).json({ error: "Account not verified" });
    }

    // Continue with the original functionality for creating a listing...
});

// PUT /api/listings/:id
app.put('/api/listings/:id', async (req: Request, res: Response) => {
    const sellerId = req.body.sellerId; // Replace with actual way to get seller ID from request

    const seller = await db.query('SELECT is_verified FROM sellers WHERE uid = ?;', [sellerId]);

    if (seller.length === 0) {
        return res.status(404).send('Seller not found');
    }

    if (seller[0].is_verified !== 1) {
        return res.status(403).json({ error: "Account not verified" });
    }

    // Continue with the original functionality for updating a listing...
});