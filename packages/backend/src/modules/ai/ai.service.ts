import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type AiProvider = 'openai' | 'nvidia' | 'openrouter' | 'groq' | 'anthropic' | 'google';

export interface AiConfig {
  provider: AiProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
  maxTokens: number;
  temperature: number;
}

export interface GenerateResponseInput {
  reviewText: string;
  reviewerName: string;
  rating: number;
  locationName: string;
  brandTone?: string;
  language?: string;
  maxLength?: number;
}

export interface GenerateResponseOutput {
  text: string;
  provider: AiProvider;
  model: string;
  tokensUsed?: number;
}

// Provider configurations with their base URLs and default models
const PROVIDER_CONFIGS: Record<AiProvider, { baseUrl: string; defaultModel: string; headerKey: string }> = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    headerKey: 'Authorization',
  },
  nvidia: {
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    defaultModel: 'meta/llama-3.1-70b-instruct',
    headerKey: 'Authorization',
  },
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'meta-llama/llama-3.1-8b-instruct:free',
    headerKey: 'Authorization',
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.1-70b-versatile',
    headerKey: 'Authorization',
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-haiku-20240307',
    headerKey: 'x-api-key',
  },
  google: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-1.5-flash',
    headerKey: 'x-goog-api-key',
  },
};

// Available models per provider
export const AVAILABLE_MODELS: Record<AiProvider, { id: string; name: string; description: string }[]> = {
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Rapido y economico, ideal para respuestas' },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Mas inteligente, mejor calidad' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Maximo rendimiento' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Economico, buena calidad' },
  ],
  nvidia: [
    { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', description: 'Potente y gratuito via NVIDIA' },
    { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', description: 'Rapido, buena calidad' },
    { id: 'mistralai/mixtral-8x22b-instruct-v0.1', name: 'Mixtral 8x22B', description: 'Excelente para español' },
    { id: 'google/gemma-2-27b-it', name: 'Gemma 2 27B', description: 'Buen balance calidad/velocidad' },
  ],
  openrouter: [
    { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Gratis)', description: 'Gratis, buena calidad' },
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', description: 'Rapido y economico' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', description: 'Rapido, buena calidad' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (via OR)', description: 'OpenAI via OpenRouter' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Gratis)', description: 'Gratis, ligero' },
  ],
  groq: [
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', description: 'Ultra rapido via Groq' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: 'Instantaneo' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Buen balance' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: 'Compacto y rapido' },
  ],
  anthropic: [
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Rapido y economico' },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balance calidad/precio' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Maximo rendimiento' },
  ],
  google: [
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Rapido y gratuito' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Alta calidad' },
    { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', description: 'Ultima generacion' },
  ],
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Generate a review response using the configured AI provider.
   * Uses OpenAI-compatible API format (works for OpenAI, NVIDIA, OpenRouter, Groq).
   * Falls back through providers if one fails.
   */
  async generateReviewResponse(
    input: GenerateResponseInput,
    config?: Partial<AiConfig>,
  ): Promise<GenerateResponseOutput> {
    const aiConfig = this.resolveConfig(config);

    const prompt = this.buildReviewResponsePrompt(input);

    // Try primary provider
    try {
      return await this.callProvider(aiConfig, prompt);
    } catch (error) {
      this.logger.error(`Primary provider ${aiConfig.provider} failed: ${error.message}`);
    }

    // Fallback: try other providers
    const fallbackOrder: AiProvider[] = ['groq', 'openrouter', 'nvidia', 'openai'];
    for (const provider of fallbackOrder) {
      if (provider === aiConfig.provider) continue;
      const fallbackKey = this.configService.get<string>(`${provider.toUpperCase()}_API_KEY`);
      if (!fallbackKey) continue;

      try {
        const fallbackConfig: AiConfig = {
          provider,
          apiKey: fallbackKey,
          model: PROVIDER_CONFIGS[provider].defaultModel,
          baseUrl: PROVIDER_CONFIGS[provider].baseUrl,
          maxTokens: aiConfig.maxTokens,
          temperature: aiConfig.temperature,
        };
        this.logger.log(`Trying fallback provider: ${provider}`);
        return await this.callProvider(fallbackConfig, prompt);
      } catch (err) {
        this.logger.error(`Fallback ${provider} also failed: ${err.message}`);
      }
    }

    // All failed - return a generic response
    this.logger.error('All AI providers failed. Returning generic response.');
    return {
      text: input.rating >= 4
        ? `Gracias por tu visita y por compartir tu experiencia con nosotros. Nos alegra saber que fue positiva. Te esperamos pronto!`
        : `Lamentamos que tu experiencia no haya sido la esperada. Tu opinion es importante para nosotros y tomaremos accion. Por favor contactanos para resolver esta situacion.`,
      provider: 'openai',
      model: 'fallback',
    };
  }

  /**
   * Call a provider using OpenAI-compatible chat completion API
   */
  private async callProvider(config: AiConfig, prompt: string): Promise<GenerateResponseOutput> {
    // Anthropic uses a different API format
    if (config.provider === 'anthropic') {
      return this.callAnthropic(config, prompt);
    }

    // Google Gemini uses a different API format
    if (config.provider === 'google') {
      return this.callGoogle(config, prompt);
    }

    // OpenAI-compatible format (OpenAI, NVIDIA, OpenRouter, Groq)
    const url = `${config.baseUrl}/chat/completions`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    };

    // OpenRouter needs extra headers
    if (config.provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://localrankfeedback.com';
      headers['X-Title'] = 'LocalRank Feedback';
    }

    const body = {
      model: config.model,
      messages: [
        { role: 'system', content: 'Eres un asistente que genera respuestas profesionales a reseñas de negocios locales. Responde en español, con tono amable y profesional.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`${config.provider} API error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) throw new Error('No response text from API');

    return {
      text,
      provider: config.provider,
      model: config.model,
      tokensUsed: data.usage?.total_tokens,
    };
  }

  /**
   * Call Anthropic Claude (different API format)
   */
  private async callAnthropic(config: AiConfig, prompt: string): Promise<GenerateResponseOutput> {
    const response = await fetch(`${config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        messages: [{ role: 'user', content: prompt }],
        system: 'Eres un asistente que genera respuestas profesionales a reseñas de negocios locales. Responde en español, con tono amable y profesional.',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text?.trim();
    if (!text) throw new Error('No response from Anthropic');

    return { text, provider: 'anthropic', model: config.model, tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens };
  }

  /**
   * Call Google Gemini (different API format)
   */
  private async callGoogle(config: AiConfig, prompt: string): Promise<GenerateResponseOutput> {
    const url = `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: config.maxTokens, temperature: config.temperature },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google API error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new Error('No response from Google');

    return { text, provider: 'google', model: config.model };
  }

  /**
   * Build the prompt for review response generation
   */
  private buildReviewResponsePrompt(input: GenerateResponseInput): string {
    const tone = input.brandTone || 'profesional, amable y cercano';
    const lang = input.language || 'español';
    const maxLen = input.maxLength || 200;

    return `Genera una respuesta a la siguiente reseña de "${input.locationName}".

RESEÑA:
- Cliente: ${input.reviewerName}
- Calificacion: ${input.rating}/5 estrellas
- Texto: "${input.reviewText}"

INSTRUCCIONES:
- Tono de marca: ${tone}
- Idioma: ${lang}
- Maximo ${maxLen} palabras
- Si es positiva (4-5 estrellas): agradece, menciona algo especifico del comentario, invita a volver
- Si es negativa (1-3 estrellas): muestra empatia, no te disculpes excesivamente, ofrece solucion, invita a contacto directo
- No uses emojis
- No uses frases genericas vacias
- Personaliza mencionando el nombre del cliente

Responde SOLO con el texto de la respuesta, sin explicaciones ni formato extra.`;
  }

  /**
   * Resolve AI configuration from env vars or overrides
   */
  private resolveConfig(overrides?: Partial<AiConfig>): AiConfig {
    const provider = (overrides?.provider || this.configService.get<string>('AI_PROVIDER') || 'openrouter') as AiProvider;
    const providerConfig = PROVIDER_CONFIGS[provider];

    return {
      provider,
      apiKey: overrides?.apiKey || this.configService.get<string>(`${provider.toUpperCase()}_API_KEY`) || this.configService.get<string>('AI_API_KEY') || '',
      model: overrides?.model || this.configService.get<string>('AI_MODEL') || providerConfig.defaultModel,
      baseUrl: overrides?.baseUrl || providerConfig.baseUrl,
      maxTokens: overrides?.maxTokens || 300,
      temperature: overrides?.temperature || 0.7,
    };
  }

  /**
   * Get available providers and models (for settings UI)
   */
  getAvailableProviders() {
    return Object.entries(AVAILABLE_MODELS).map(([provider, models]) => ({
      id: provider,
      name: this.getProviderDisplayName(provider as AiProvider),
      models,
    }));
  }

  private getProviderDisplayName(provider: AiProvider): string {
    const names: Record<AiProvider, string> = {
      openai: 'OpenAI',
      nvidia: 'NVIDIA NIM',
      openrouter: 'OpenRouter',
      groq: 'Groq',
      anthropic: 'Anthropic (Claude)',
      google: 'Google (Gemini)',
    };
    return names[provider];
  }
}
