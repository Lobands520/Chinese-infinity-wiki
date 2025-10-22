import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set. Please set the environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-flash-lite";

type Language = 'zh' | 'en';

const generateInitialEntry = async (language: Language): Promise<string> => {
    try {
        const prompts = {
            zh: "你就是“无限维基”。请用中文生成初始欢迎信息。它必须是一个简短、神秘的段落，介绍一个可以无限探索的维基概念，其中每个汉字都是通往新知识的门户。风格应极简而深刻。文本以“此为无限维基。”开始，并保持在50个汉字以内。请只返回纯文本，不要包含任何Markdown格式或特殊标记。",
            en: "You are the 'Infinity Wiki'. Generate the initial welcome message in English. It must be a single, short, mysterious paragraph introducing the concept of an endlessly explorable wiki where every word is a gateway to new knowledge. The style should be minimal and profound. Start the text with 'This is the Infinity Wiki.' and keep it under 25 words."
        };
        const prompt = prompts[language];
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating initial entry:", error);
        const errorMessages = {
            zh: "错误：无法连接到生成意识。每个开始都蕴含着潜在的错误，一条未被选择的道路。点击重试。",
            en: "Error: Could not connect to the generative consciousness. Every beginning holds a potential error, a path not taken. Click to retry."
        };
        return errorMessages[language];
    }
};


const generateWikiEntry = async (topic: string, language: Language): Promise<string> => {
    try {
        const prompts = {
            zh: `你是一个不断扩展、充满哲思且引人入胜的信息来源——“无限维基”。你的风格极简、深刻，略带神秘。请用中文围绕概念“${topic}”生成一段新的维基词条。请不要在回应中重复“${topic}”这个词。内容需要比之前更丰富一些，大约在70-100个汉字之间，旨在唤起一种奇妙深邃的感觉。请只返回纯文本，不要包含任何Markdown格式或特殊标记。`,
            en: `You are 'Infinity Wiki', a source of ever-expanding, concise, and fascinating information. Your style is minimalist, profound, and slightly mysterious. Generate a new, short (under 25 words), single-paragraph wiki entry in English about the concept of: '${topic}'. Do not repeat the topic in your response. The entry should evoke a sense of wonder.`
        };
        const prompt = prompts[language];

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error(`Error generating entry for "${topic}":`, error);
        const errorMessages = {
            zh: `错误：关于“${topic}”的概念似乎已从存在的裂缝中溜走。或许，试试另一个字。`,
            en: `Error: The concept of "${topic}" seems to have slipped through a crack in existence. Perhaps, try another word.`
        }
        return errorMessages[language];
    }
};

export { generateWikiEntry, generateInitialEntry };
export type { Language };