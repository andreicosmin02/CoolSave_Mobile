import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// Add this new component
// eslint-disable-next-line react/display-name
const RecipeItem = React.memo(({ item, onDelete }: { item: IRecipe; onDelete: (id: string, title: string) => void }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.itemContent} 
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.ingredients}>
          Ingredients: {item.ingredients.length} items
        </Text>
        <Text style={styles.date}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
        
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(item._id, item.title)}
        >
          <MaterialIcons size={20} name="delete" color="red" />
        </TouchableOpacity>
      </View>
      <Text 
          style={styles.instructions}
          numberOfLines={expanded ? undefined : 2}
          ellipsizeMode="tail"
        >
          {item.instructions}
        </Text>
    </View>
  );
});

export default function RecipeScreen() {
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingRecipe, setGeneratingRecipe] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchRecipes();
      setRefreshing(false);
    }, 2000);
  };

  const generateNewRecipe = async () => {
    try {
      setGeneratingRecipe(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}api/recipe/generate`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newRecipe = await response.json();
      setRecipes(prev => [newRecipe, ...prev]);
      Alert.alert('Success', 'New recipe generated successfully!');
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      Alert.alert('Error', 'Failed to generate recipe. Please try again.');
    } finally {
      setGeneratingRecipe(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}api/recipe`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRecipes(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setError(error.message || 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}api/recipe/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setRecipes(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      Alert.alert('Error', 'Failed to delete recipe. Please try again.');
    }
  };

  const confirmDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${title}"?`,
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
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateNewRecipe}
          disabled={generatingRecipe}
        >
          {generatingRecipe ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <MaterialIcons name="auto-awesome" size={20} color="white" />
              <Text style={styles.buttonText}>Genereaza reteta noua</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={recipes}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <RecipeItem 
            item={item}
            onDelete={confirmDelete}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recipes found</Text>
        }
      />
    </View>
  );
}

interface IRecipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  created_at: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});