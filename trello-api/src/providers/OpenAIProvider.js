import OpenAI from 'openai'
import { env } from '~/config/environment'

let openaiClient = null

const GET_OPENAI_CLIENT = () => {
  if (openaiClient) return openaiClient

  openaiClient = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  })

  return openaiClient
}

const invokeOpenAIModel = async ({ prompt, maxTokens = 1500, json = true }) => {
  const client = GET_OPENAI_CLIENT()

  try {
    const res = await client.responses.create({
      model: 'gpt-4o',
      max_output_tokens: maxTokens,

      ...(json && {
        text: {
          format: { type: 'json_object' }
        }
      }),

      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text', // ✅ QUAN TRỌNG
              text: prompt
            }
          ]
        }
      ]
    })

    // Lấy output text đúng schema mới
    const text = res.output
      .flatMap((o) => o.content)
      .filter((c) => c.type === 'output_text')
      .map((c) => c.text)
      .join('')

    return text
  } catch (err) {
    console.error('OpenAI error:', err)
    throw new Error(`OpenAI error: ${err?.message}`)
  }
}

export { GET_OPENAI_CLIENT, invokeOpenAIModel }
