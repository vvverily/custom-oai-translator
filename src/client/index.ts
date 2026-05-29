import { fetchEventSource, FetchEventSourceInit } from '@microsoft/fetch-event-source';
import axios from 'axios';

import apis from '@/client/apis';

const { endpoints, baseUrl } = apis;
let currentBaseUrl = baseUrl;

const client = axios.create({ baseURL: baseUrl });

export function setApiBaseUrl(url: string) {
  client.defaults.baseURL = url;
  currentBaseUrl = url;
}

export async function fetchModels(token: string) {
  const { url } = endpoints.v1.models;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await client.get<ModelsResponse>(url, config);
  return response.data.data.map((model) => model.id);
}

export async function completions(
  token: string,
  prompt: string,
  query: string,
  model: string,
  temperature = 0,
  maxTokens = 1000,
  topP = 1,
  frequencyPenalty = 1,
  presencePenalty = 1,
) {
  const { url, headers } = endpoints.v1.completions;
  const config = {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };

  const body = {
    prompt: `${prompt}:\n\n"${query}" =>`,
    model,
    temperature,
    // eslint-disable-next-line camelcase
    max_tokens: maxTokens,
    // eslint-disable-next-line camelcase
    top_p: topP,
    // eslint-disable-next-line camelcase
    frequency_penalty: frequencyPenalty,
    // eslint-disable-next-line camelcase
    presence_penalty: presencePenalty,
  };

  const response = await client.post<CompletionsResponse>(url, body, config);
  return response;
}

export async function chatCompletions(
  token: string,
  prompt: string,
  query: string,
  model: string,
  temperature = 0,
  maxTokens = 1000,
  topP = 1,
  frequencyPenalty = 1,
  presencePenalty = 1,
) {
  const { url, headers } = endpoints.v1.chat.completions;
  const config = {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };

  const body = {
    model,
    temperature,
    // eslint-disable-next-line camelcase
    max_tokens: maxTokens,
    // eslint-disable-next-line camelcase
    top_p: topP,
    // eslint-disable-next-line camelcase
    frequency_penalty: frequencyPenalty,
    // eslint-disable-next-line camelcase
    presence_penalty: presencePenalty,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: query },
    ],
  };

  const response = await client.post<ChatCompletionsResponse>(url, body, config);
  return response;
}

export async function chatCompletionsStream(
  params: {
    token: string;
    prompt: string;
    query: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  },
  options: FetchEventSourceInit,
) {
  const {
    token,
    prompt,
    query,
    model = '',
    temperature = 0,
    maxTokens = 1000,
    topP = 1,
    frequencyPenalty = 1,
    presencePenalty = 1,
  } = params;
  const { url, headers } = endpoints.v1.chat.completions;

  const body = {
    model,
    temperature,
    // eslint-disable-next-line camelcase
    max_tokens: maxTokens,
    // eslint-disable-next-line camelcase
    top_p: topP,
    // eslint-disable-next-line camelcase
    frequency_penalty: frequencyPenalty,
    // eslint-disable-next-line camelcase
    presence_penalty: presencePenalty,
    stream: true,
    messages: [
      {
        role: 'system',
        content: `${prompt}\nPlease note that your response should solely consist of the translation.`,
      },
      { role: 'user', content: query },
    ],
  };
  const response = await fetchEventSource(currentBaseUrl + url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    openWhenHidden: true,
    ...options,
  });
  return response;
}

const ApiClient = {
  setApiBaseUrl,
  fetchModels,
  chatCompletions,
  chatCompletionsStream,
};

export default ApiClient;
