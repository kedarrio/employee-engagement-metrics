import { GoogleGenAI } from "@google/genai";
import { SurveyEntry } from "../types";
import { METRICS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImpact = async (entries: SurveyEntry[]): Promise<string> => {
  if (entries.length === 0) {
    return "No data available to analyze.";
  }

  // Aggregate data for the prompt
  const beforeEntries = entries.filter(e => e.type === 'BEFORE');
  const afterEntries = entries.filter(e => e.type === 'AFTER');

  const calculateAvg = (subset: SurveyEntry[], metricId: string) => {
    const valid = subset.filter(e => e.ratings[metricId] !== undefined);
    if (valid.length === 0) return 'N/A';
    const sum = valid.reduce((acc, curr) => acc + curr.ratings[metricId], 0);
    return (sum / valid.length).toFixed(2);
  };

  // Construct a summary object
  const summary = {
    totalParticipants: entries.length,
    beforeCount: beforeEntries.length,
    afterCount: afterEntries.length,
    metrics: {
      shared: METRICS.shared.map(m => ({
        metric: m.label,
        beforeAvg: calculateAvg(beforeEntries, m.id),
        afterAvg: calculateAvg(afterEntries, m.id),
      })),
      beforeSpecific: METRICS.before.map(m => ({
        metric: m.label,
        avg: calculateAvg(beforeEntries, m.id)
      })),
      afterSpecific: METRICS.after.map(m => ({
        metric: m.label,
        avg: calculateAvg(afterEntries, m.id)
      }))
    },
    comments: entries
      .filter(e => e.comments && e.comments.length > 5)
      .map(e => `[${e.type}] ${e.comments}`)
      .slice(0, 20) // Limit comments to avoid token limits in simple demo
  };

  const prompt = `
    You are an expert organizational psychologist.
    Analyze this cultural event survey data and produce a **highly readable, visually engaging report**.

    Data:
    ${JSON.stringify(summary, null, 2)}
    
    **Format Rules:**
    1. Use a professional but encouraging tone.
    2. **DO NOT** use long paragraphs. Use short, punchy sentences.
    3. Use **bullet points** for all lists and insights.
    4. Use **bold text** for key numbers and percentage changes.
    5. Use emojis as section headers to make it visually scanning.
    
    **Required Sections:**
    ### 🚀 Executive Summary
    (2 sentences max)

    ### 📊 Key Metric Shifts
    *   Compare Mood, Energy, etc.
    *   Highlight the biggest wins.

    ### 🧠 Stress vs. Relief
    *   Analyze the shift from pre-event stress to post-event relief.

    ### 💡 Recommendations
    *   3 bullet points for future events.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple analysis
      }
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Error generating impact analysis:", error);
    return "An error occurred while contacting the AI service. Please check your API key and try again.";
  }
};