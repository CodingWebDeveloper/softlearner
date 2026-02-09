import { IAiTestsService, AiGenerateQuestionsInput, AiGeneratedQuestionDto } from "@/services/interfaces/service.interfaces";
import { GoogleGenAI } from "@google/genai";

export class AiTestsService implements IAiTestsService {
  private genAI: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    this.genAI = new GoogleGenAI({apiKey,});
  }

  async generateQuestions(input: AiGenerateQuestionsInput): Promise<AiGeneratedQuestionDto[]> {
    const { topic, numQuestions = 5, difficulty = "medium" } = input;

    const prompt = [
      `Generate ${numQuestions} multiple-choice questions about the topic: "${topic}".`,
      `Difficulty: ${difficulty}.`,
      "Return ONLY valid JSON with the shape: { \"questions\": [ { \"text\": string, \"options\": [ { \"text\": string, \"isCorrect\": boolean } ... exactly 4 options ], \"type\": \"single\", \"points\": 1 } ] }.",
      "Do not include explanations or markdown. Make options concise and unambiguous.",
    ].join("\n");
    const response = await this.genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: prompt }] },
      ],
    });

    const text = response.text ?? "";

    const extractJsonString = (raw: string): string => {
      const cleaned = raw
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        return cleaned.slice(start, end + 1);
      }
      return cleaned;
    };

    let data: any;
    try {
      data = JSON.parse(extractJsonString(text));
    } catch {
      const retry = await this.genAI.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: [
          { role: "user", parts: [{ text: prompt }] },
          { role: "user", parts: [{ text: "Remember: Output MUST be pure JSON with no comments or backticks." }] },
        ],
      });
      const retryText = retry.text ?? "";
      data = JSON.parse(extractJsonString(retryText));
    }

    const questions = Array.isArray(data?.questions) ? data.questions : [];

    const normalized: AiGeneratedQuestionDto[] = questions
      .slice(0, numQuestions)
      .map((q: any) => ({
        text: String(q.text ?? "").trim(),
        type: (q.type === "multiple" ? "multiple" : "single") as "single" | "multiple",
        points: typeof q.points === "number" ? q.points : 1,
        options: Array.isArray(q.options)
          ? q.options.slice(0, 6).map((o: any) => ({
              text: String(o.text ?? "").trim(),
              isCorrect: Boolean(o.isCorrect),
            }))
          : [],
      }))
      .filter((q: AiGeneratedQuestionDto) => q.text && q.options.length >= 2 && q.options.some((o) => o.isCorrect));

    const finalized = normalized.map((q) => {
      if (q.type === "single") {
        const opts = q.options.slice(0, 4);
        while (opts.length < 4) {
          opts.push({ text: `Option ${opts.length + 1}`, isCorrect: false });
        }
        return { ...q, options: opts };
      }
      return q;
    });

    return finalized;
  }
}
