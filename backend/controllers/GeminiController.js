const { GoogleGenerativeAI } = require("@google/generative-ai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const getFinancialAdvice = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({error: "Prompt is required"});
        }
        const femaleFocused = ". Ensure the response is respectful and recognizes gender inequity and barriers for females regarding financial literacy. 100 words or less"
        const fullPrompt = prompt + femaleFocused;

        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-lite"});
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        res.status(200).json(response.text());        
    } catch (err) {
        console.error('Gemini Error:', err);
        res.status(400).json({error: err.message})
    }
}

module.exports = {
    getFinancialAdvice
}