import express from 'express';
import cors from 'cors'; // Don't forget to install this if you haven't: npm install cors
import { ENV } from './config/env.js';
import { db } from './config/db.js';
import { favoritesTable } from './db/schema.js';
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT || 5001;

// 1. ENABLE CORS
app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
    console.log("Health check pinged!");
    res.status(200).json({ status: true });
});

// 2. ADD FAVORITE (With Logs)
app.post("/api/favorites", async (req, res) => {
    console.log("\n--- 📥 RECEIVED POST REQUEST: ADD FAVORITE ---");
    console.log("👉 Request Body:", req.body); // PRINT THE DATA SENT FROM MOBILE

    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        // Validation Log
        if (!userId || !recipeId || !title) {
            console.log("❌ Missing fields! userId:", userId, "recipeId:", recipeId, "title:", title);
            return res.status(400).json({ error: "Missing required fields" });
        }

        console.log("✅ Validation passed. Inserting into DB...");

        const newFavorite = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning();

        console.log("🎉 SUCCESS! Saved to DB:", newFavorite[0]);
        res.status(201).json(newFavorite[0]);

    } catch (error) {
        console.log("🔥 SERVER ERROR while adding favorite:", error);
        res.status(500).json({ error: "Failed to add favorite" });
    }
});

// 3. REMOVE FAVORITE
app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
    try {
        const { userId, recipeId } = req.params;
        console.log(`\n--- 🗑️ DELETING FAVORITE: User ${userId} Recipe ${recipeId} ---`);

        await db.delete(favoritesTable)
            .where(
                and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
            );

        console.log("✅ Deleted successfully.");
        res.status(200).json({ message: "Favorite removed successfully" });

    } catch (error) {
        console.log("🔥 Error removing favorite:", error);
        res.status(500).json({ error: "Failed to remove favorite" });
    }
});

// 4. GET FAVORITES
app.get("/api/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`\n--- 🔍 FETCHING FAVORITES for User ${userId} ---`);

        const favorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));
        
        console.log(`✅ Found ${favorites.length} favorites.`);
        res.status(200).json(favorites);

    } catch (error) {
        console.log("🔥 Error fetching favorites", error);
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
});

// 5. LISTEN ON 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Accepting connections from Emulator (10.0.2.2)`);
});