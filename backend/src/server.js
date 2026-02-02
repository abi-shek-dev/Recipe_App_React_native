import express from 'express';
import { ENV } from './config/env.js';
import { db } from './config/db.js';
import { favoritesTable } from './db/schema.js';
import { and, eq } from "drizzle-orm";


const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: true });
})

app.post("/api/favourites", async (req, res) => {

    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        if (!userId || !recipeId || !title) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newFavorite = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning();

        res.status(201).json(newFavorite[0]);

    } catch (error) {
        console.log("Error adding favourite", error);
        res.status(500).json({ error: "Failed to add favourite" });
    }

});

app.delete("/api/favourites/:userId/:recipeId", async (req, res) => {

    try {

        const { userId, recipeId } = req.params;

        await db.delete(favoritesTable)
            .where(
                and(eq(favoritesTable.userId,userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
            );

        res.status(200).json({ message: "Favourite removed successfully" });

    } catch (error) {
        console.log("Error removing a favourite ", error);
        res.status(500).json({ error: "Failed to remove favourite" });
    }

});

app.get("/api/favourites/:userId", async (req, res) => {

    try {
        
        const { userId } = req.params;

        const favorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));

        res.status(200).json(favorites);

    } catch (error) {
        console.log("Error fetching favorites", error);
        res.status(500).json({ error: "Failed to fetch favorites" });
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});