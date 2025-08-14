import { apiClient } from './apiClient';

// Environment-based configuration
const config = {
  development: {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 30000,
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL || '/api',
    timeout: 45000,
  },
};

const currentConfig = config[import.meta.env.MODE as keyof typeof config] || config.development;

// Configure apiClient
apiClient.setBaseURL(currentConfig.apiUrl);
apiClient.setTimeout(currentConfig.timeout);

export { currentConfig as config };
export { apiClient };

// Debug log for development
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    mode: import.meta.env.MODE,
    apiUrl: currentConfig.apiUrl,
    timeout: currentConfig.timeout,
  });
}
