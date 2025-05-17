import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function FoodScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [foodProducts, setFoodProducts] = useState<IFoodProduct[]>([]);

  useEffect(() => {
    fetchFoodProducts();
  }, []);

  const fetchFoodProducts = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}api/food-products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFoodProducts(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch food products:', error);
      setError(error.message || 'Failed to fetch food products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}api/food-products/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove item from local state
      setFoodProducts(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete food product:', error);
      Alert.alert('Error', 'Failed to delete food product. Please try again.');
    }
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Food Product',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDelete(id) }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foodProducts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.date}>
                Expires: {new Date(item.expirationDate).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => confirmDelete(item._id, item.name)}
            >
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No food products found</Text>
        }
      />
    </View>
  );
}

interface IFoodProduct {
  _id: string;
  name: string;
  category: string;
  expirationDate: string;
  createdAt?: string;
  updatedAt?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 16,
  },
  deleteText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});