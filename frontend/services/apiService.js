import api from '../api';

// PiggyBank API functions
export const piggyBankService = {
  // Get all piggy banks
  getAll: async () => {
    try {
      const response = await api.get('/piggybanks');
      return response.data;
    } catch (error) {
      console.error('Error fetching piggy banks:', error);
      throw error;
    }
  },

  // Get piggy bank by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/piggybanks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching piggy bank:', error);
      throw error;
    }
  },

  // Create new piggy bank
  create: async (piggyBankData) => {
    try {
      const response = await api.post('/piggybanks', piggyBankData);
      return response.data;
    } catch (error) {
      console.error('Error creating piggy bank:', error);
      throw error;
    }
  },

  // Update piggy bank
  update: async (id, piggyBankData) => {
    try {
      const response = await api.put(`/piggybanks/${id}`, piggyBankData);
      return response.data;
    } catch (error) {
      console.error('Error updating piggy bank:', error);
      throw error;
    }
  },

  // Delete piggy bank
  delete: async (id) => {
    try {
      const response = await api.delete(`/piggybanks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting piggy bank:', error);
      throw error;
    }
  }
};

// Transaction API functions
export const transactionService = {
  // Get all transactions
  getAll: async () => {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      console.error("❌ Error fetching piggy banks:", error)
      console.error("❌ Error details:", error.response?.data);
      console.error("❌ Status code:", error.response?.status);
      console.error("❌ Request URL:", error.config?.url);
      console.error("❌ Full error object:", JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Get transaction by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  // Create new transaction
  create: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Update transaction
  update: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Delete transaction
  delete: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Allocate transaction to a piggy bank
  allocate: async (transactionId, piggyBankId) => {
    try {
      const response = await api.post('/transactions/allocate', {
        transactionId,
        piggyBankId
      });
      return response.data;
    } catch (error) {
      console.error('Error allocating transaction:', error);
      throw error;
    }
  }
};

// AI/Gemini API functions
export const aiService = {
  // Get AI assistance/advice
  getAdvice: async (query) => {
    try {
      console.log('Sending AI request with prompt:', query);
      const response = await api.post('/ai', { prompt: query });
      console.log('AI response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting AI advice:', error);
      console.error('Error details:', error.response?.data || error.message);
      console.error('Status code:', error.response?.status);
      throw error;
    }
  },

  // Analyze spending patterns
//   analyzeSpending: async (transactionData) => {
//     try {
//       const response = await api.post('/ai/analyze', { transactions: transactionData });
//       return response.data;
//     } catch (error) {
//       console.error('Error analyzing spending:', error);
//       throw error;
//     }
//   }
};

// Example usage functions you can use in your screens
export const apiExamples = {
  // Example: Load all piggy banks for HomeScreen
  loadPiggyBanks: async () => {
    try {
      const piggyBanks = await piggyBankService.getAll();
      console.log('Loaded piggy banks:', piggyBanks);
      return piggyBanks;
    } catch (error) {
      console.error('Failed to load piggy banks:', error);
      return [];
    }
  },

  // Example: Log a new transaction
  logTransaction: async (amount, description, category, piggyBankId = null) => {
    try {
      const transaction = await transactionService.create({
        amount,
        description,
        category,
        piggyBankId,
        date: new Date().toISOString()
      });
      console.log('Transaction logged:', transaction);
      return transaction;
    } catch (error) {
      console.error('Failed to log transaction:', error);
      throw error;
    }
  },

  // Example: Get AI financial advice
  getFinancialAdvice: async (question) => {
    try {
      const advice = await aiService.getAdvice(question);
      console.log('AI advice:', advice);
      return advice;
    } catch (error) {
      console.error('Failed to get AI advice:', error);
      return 'Sorry, I could not provide advice at this time.';
    }
  }
};