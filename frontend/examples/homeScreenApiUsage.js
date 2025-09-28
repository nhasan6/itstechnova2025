// Example: How to use the API in your HomeScreen.tsx
// Add this import at the top of your HomeScreen.tsx:

import { piggyBankService, transactionService, apiExamples } from '../../services/apiService';

// Then in your HomeScreen component, add these functions:

const HomeScreen = () => {
  const [piggyBanks, setPiggyBanks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load piggy banks and transactions simultaneously
      const [piggyBanksData, transactionsData] = await Promise.all([
        piggyBankService.getAll(),
        transactionService.getAll()
      ]);
      
      setPiggyBanks(piggyBanksData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      // You can show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  // Example function to create a new piggy bank
  const createPiggyBank = async () => {
    try {
      const newPiggyBank = await piggyBankService.create({
        name: "Emergency Fund",
        goal: 1000,
        balance: 0,
        opened: false
      });
      
      // Refresh the data after creating
      loadData();
    } catch (error) {
      console.error('Error creating piggy bank:', error);
    }
  };

  // Example function to log a transaction
  const logTransaction = async () => {
    try {
      const newTransaction = await transactionService.create({
        amount: 50,
        description: "Coffee purchase",
        category: "Food & Drink",
        date: new Date().toISOString()
      });
      
      // Refresh the data after logging
      loadData();
    } catch (error) {
      console.error('Error logging transaction:', error);
    }
  };

  // Your existing JSX code here...
  // You can now use the piggyBanks and transactions state in your render
};