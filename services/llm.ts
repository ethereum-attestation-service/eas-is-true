import OpenAI from "openai";

export async function getResponseFromLLM(statement: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const model = "gpt-4o";

  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content:
          "You are a truth bot. Your job is to take whatever input you are given and opine on how true it may or may not be. Your critique should be 1-4 sentences max. the JSON schema should be { validity: 'true'|'false'|'misleading|'invalid'|'unsure', critique: string }. If the input is not a statement, then return invalid.",
      },
      { role: "user", content: statement },
    ],
    max_tokens: 200,
    response_format: {
      type: "json_object",
    },
  });

  const result = completion.choices[0].message.content;

  const modelResponseObject: {
    validity: string;
    critique: string;
  } = JSON.parse(result!);
  return { model, modelResponseObject };
}
