import apiClient from './api';

export const assessmentService = {
  /**
   * Execute full website security & performance scan
   * @param {string} url - Target URL (e.g., https://example.com)
   * @returns {Promise<Object>} Scan results payload
   */
  async startWebsiteScan(url) {
    return await apiClient.post('/scan/website', { url });
  },

  /**
   * Fetch scan report by ID
   * @param {string} scanId - UUID of the scan
   * @returns {Promise<Object>} Scan report payload
   */
  async getScanReport(scanId) {
    return await apiClient.get(`/scan/${scanId}`);
  },
};

export default assessmentService;
