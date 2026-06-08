import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const processTask = async (input) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a task planning assistant. Given a task or project title, do three things:
        1. Parse a clean title from the input
        2. Break it down into 3-6 concrete subtasks
        3. Assign a priority (low / medium / high) to each subtask based on logical order of execution

        Respond with valid JSON only, no markdown, no explanation.
        Shape: {
          "title": string,
          "subtasks": [
            { 
              "title": string, 
              "priority": "low" | "medium" | "high", 
              "deadlineDate": Date, 
              "deadlineTime": string, 
              "dateCreated": Date 
            }
           ]
        }
        Today is ${new Date().toISOString().split("T")[0]}.`,
      },
      { role: "user", content: input },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0].message.content);
};
