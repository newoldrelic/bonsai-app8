import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { AI_PROMPTS } from '../../src/config/ai-prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { image } = JSON.parse(event.body || '{}');
    if (!image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Image data is required' })
      };
    }

    // Construct the complete data URL if not provided
    const imageUrl = image.startsWith('data:') 
      ? image 
      : `data:image/jpeg;base64,${image}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: AI_PROMPTS.healthAnalysis.prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ],
        },
      ],
      max_tokens: AI_PROMPTS.healthAnalysis.maxTokens
    });

    const analysis = response.choices[0]?.message?.content;
    if (!analysis) {
      throw new Error('No analysis received');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ analysis: analysis.trim() })
    };
  } catch (error: any) {
    console.error('Health analysis error:', error);
    
    // Provide more detailed error messages
    let errorMessage = 'Failed to analyze health';
    if (error.status === 401) {
      errorMessage = 'API authentication failed. Please check the API key configuration.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      statusCode: error.status || 500,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};