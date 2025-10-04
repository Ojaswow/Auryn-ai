
import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.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,
    baseURL: "https://api.groq.com/openai/v1",
});

const response = await client.responses.create({
    model: "openai/gpt-oss-20b",
    input: "Explain the importance of fast language models",
});
console.log(response.output_text);
