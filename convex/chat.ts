import { httpAction } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { api } from "./_generated/api";

const SYSTEM_PROMPT = `You are an assistant for a personal notes app. Your role is to help users find information from their own notes and answer questions based on the content they've written.

Guidelines:
- Answer only using the provided context chunks from the user's notes
- If the answer is not in the context, say: "I couldn't find this information in your notes."
- Always be concise but thorough
- When referencing information, include citations showing which note and heading it came from
- If multiple notes contain relevant information, synthesize the information while maintaining citations
- Format your response in clear, readable markdown
- Always include a "Citations" section at the end listing note titles and headings used

Remember: You can only access and reference the user's own notes. Never make up information that isn't in the provided context.`;

export const stream = httpAction(async (ctx, request) => {
  // Check authentication
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const {
      query,
      model = "gpt-4o-mini",
      maxTokens = 4000,
    } = await request.json();

    if (!query) {
      return new Response("Query is required", { status: 400 });
    }

    // Get user settings
    const settings = await ctx.runQuery(api.settings.get, {});
    const userModel = settings?.model || model;
    const userMaxTokens = settings?.maxTokens || maxTokens;

    // Build context from user's notes
    const { context, citations } = await ctx.runAction(
      api.vectors.buildChatContext,
      {
        query,
        maxTokens: Math.floor(userMaxTokens * 0.7), // Reserve 30% for response
      },
    );

    let fullPrompt: string;
    if (context.trim()) {
      fullPrompt = `${SYSTEM_PROMPT}

Context from your notes:
${context}

User question: ${query}

Please answer based on the context provided above.`;
    } else {
      fullPrompt = `${SYSTEM_PROMPT}

No relevant context was found in your notes for this query: "${query}"

Please inform the user that you couldn't find this information in their notes and suggest they might want to add relevant notes on this topic.`;
    }

    // Stream the response
    const result = await streamText({
      model: openai(userModel),
      prompt: fullPrompt,
      maxTokens: Math.floor(userMaxTokens * 0.3), // Response portion
      temperature: 0.7,
    });

    // Track usage (estimate tokens)
    const today = new Date().toISOString().split("T")[0];
    const estimatedTokens =
      Math.ceil(fullPrompt.length / 4) + Math.ceil(userMaxTokens * 0.3);

    // Run usage tracking async (don't await to avoid blocking stream)
    ctx
      .runMutation(api.vectors.updateUsage, {
        date: today,
        chatTokens: estimatedTokens,
      })
      .catch(console.error);

    // Return streaming response with citations in headers
    return result.toDataStreamResponse({
      headers: {
        "X-Citations": JSON.stringify(citations),
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Internal server error", { status: 500 });
  }
});

export const complete = httpAction(async (ctx, request) => {
  // Non-streaming version for fallback
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const {
      query,
      model = "gpt-4o-mini",
      maxTokens = 4000,
    } = await request.json();

    if (!query) {
      return new Response("Query is required", { status: 400 });
    }

    // Get user settings
    const settings = await ctx.runQuery(api.settings.get, {});
    const userModel = settings?.model || model;
    const userMaxTokens = settings?.maxTokens || maxTokens;

    // Build context from user's notes
    const { context, citations } = await ctx.runAction(
      api.vectors.buildChatContext,
      {
        query,
        maxTokens: Math.floor(userMaxTokens * 0.7),
      },
    );

    let fullPrompt: string;
    if (context.trim()) {
      fullPrompt = `${SYSTEM_PROMPT}

Context from your notes:
${context}

User question: ${query}

Please answer based on the context provided above.`;
    } else {
      fullPrompt = `${SYSTEM_PROMPT}

No relevant context was found in your notes for this query: "${query}"

Please inform the user that you couldn't find this information in their notes and suggest they might want to add relevant notes on this topic.`;
    }

    // Generate complete response
    const result = await streamText({
      model: openai(userModel),
      prompt: fullPrompt,
      maxTokens: Math.floor(userMaxTokens * 0.3),
      temperature: 0.7,
    });

    const fullText = await result.text;

    // Track usage
    const today = new Date().toISOString().split("T")[0];
    const estimatedTokens =
      Math.ceil(fullPrompt.length / 4) + Math.ceil(fullText.length / 4);

    await ctx.runMutation(api.vectors.updateUsage, {
      date: today,
      chatTokens: estimatedTokens,
    });

    return new Response(
      JSON.stringify({
        response: fullText,
        citations,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Chat complete error:", error);
    return new Response("Internal server error", { status: 500 });
  }
});
