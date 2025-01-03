import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const TransactionsScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0); // State to store total amount

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://192.168.43.72:3000/transactions');
                const data = await response.json();

                // Filter for transactions with 'succeeded' status
                const succeededTransactions = data.data.filter(transaction => transaction.status === 'succeeded');
                
                // Calculate the total amount
                const total = succeededTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
                setTotalAmount(total);

                // Update the state with filtered transactions
                setTransactions(succeededTransactions);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const renderTransaction = ({ item }) => (
        <View style={styles.transactionCard}>
            <Text style={styles.title}>Transaction ID: {item.id}</Text>
            <Text>Amount: ${item.amount / 100}</Text>
            <Text>Status: <Text style={{color:'green'}}>{item.status}</Text></Text>
            <Text>Created: {new Date(item.created * 1000).toLocaleString()}</Text>
        </View>
    );

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Total Amount */}
            <Text style={styles.totalAmount}>
                Total Amount: PKR{totalAmount / 100}
            </Text>

            {/* Transactions List */}
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={renderTransaction}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    transactionCard: {
        padding: 16,
        margin: 8,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TransactionsScreen;
