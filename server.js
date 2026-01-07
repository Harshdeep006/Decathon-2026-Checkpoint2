require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai'); // CHANGED: Import OpenAI

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

// CHANGED: Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

// THE AGENTIC AI ROUTE
app.post('/api/optimize-traffic', async (req, res) => {
    try {
        const { situation } = req.body; 

        // CHANGED: The OpenAI System Prompt
        const systemPrompt = `
        You are an Autonomous Traffic Control Agent. 
        You manage a city grid with 4 Sectors: "sector1", "sector2", "sector3", "sector4".
        
        YOUR JOB:
        1. Analyze the emergency/traffic situation provided by the user.
        2. Decide which sectors need a GREEN light and which need RED.
        3. Prioritize Ambulances and Fire Trucks.
        
        RETURN JSON ONLY. Format:
        {
            "lights": {
                "sector1": "green" or "red",
                "sector2": "green" or "red",
                "sector3": "green" or "red",
                "sector4": "green" or "red"
            },
            "reason": "A short, 1-sentence explanation of your action."
        }
        `;

        // CHANGED: Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Fast and cheap model
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `CURRENT SITUATION: "${situation}"` }
            ],
            response_format: { type: "json_object" } // OpenAI specific feature to guarantee JSON
        });

        const text = completion.choices[0].message.content;

        console.log("AI Decision:", text); 
        res.json(JSON.parse(text));

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "The Traffic Agent is offline." });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`✅ GridFlow (OpenAI) Server running at http://localhost:${port}`);
});