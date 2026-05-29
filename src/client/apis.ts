export default {
  baseUrl: 'http://localhost:11434/v1',
  endpoints: {
    v1: {
      models: {
        url: '/v1/models',
        method: 'GET',
      },
      completions: {
        url: '/v1/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      chat: {
        completions: {
          url: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      },
    },
  },
};
