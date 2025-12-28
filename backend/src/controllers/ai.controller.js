
export const solveDoubt = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ message: "Groq API key not configured" });
        }

        let Groq;
        try {
            const module = await import("groq-sdk");
            Groq = module.default;
        } catch (err) {
            console.error("Groq module not found. Please install it with 'npm install groq-sdk'");
            return res.status(500).json({ message: "AI module missing on server" });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "openai/gpt-oss-120b",
        });

        const text = completion.choices[0]?.message?.content || "";
        res.json({ answer: text });
    } catch (error) {
        console.error("AI Error Detailed:", error);
        if (!process.env.GROQ_API_KEY) {
            console.error("CRITICAL: GROQ_API_KEY is missing in environment variables.");
        }
        res.status(500).json({ message: "Failed to process doubt", error: error.message });
    }
};
