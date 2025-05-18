// app/food/edit/[product].tsx
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditFoodScreen() {
  const { product } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('altă categorie');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [maxDays, setMaxDays] = useState(31);
  const [dateError, setDateError] = useState('');

  const categories = [
    'lactate',
    'mâncare tradițională',
    'grătar',
    'legume',
    'desert',
    'dulciuri',
    'ouă',
    'fructe',
    'conserve',
    'altă categorie'
  ];

  const months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}api/food-products/${product}`
        );
        const data = await response.json();
        
        setName(data.name);
        setCategory(data.category);
        
        const expDate = new Date(data.expirationDate);
        setDay(expDate.getDate().toString());
        setMonth(expDate.getMonth() + 1);
        setYear(expDate.getFullYear());
        
      } catch (error) {
        Alert.alert('Error', 'Failed to load product data');
        router.back();
      }
    };

    fetchProduct();
  }, [product]);

  useEffect(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    setMaxDays(daysInMonth);
    if (day && parseInt(day) > daysInMonth) setDay('');
  }, [day, month, year]);

  const validateDate = () => {
    if (!day || !month || !year) {
      setDateError('Please select a complete date');
      return false;
    }

    const selectedDate = new Date(year, month - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError('Date cannot be in the past');
      return false;
    }

    if (isNaN(selectedDate.getTime())) {
      setDateError('Invalid date');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!name || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateDate()) return;

    try {
      setLoading(true);
      const expirationDate = new Date(year, month - 1, parseInt(day)).toISOString();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}api/food-products/${product}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            category,
            expirationDate,
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      Alert.alert('Success', 'Product updated successfully!');
      router.back();
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Food Name</Text>
      <TextInput
        style={styles.nameInput}
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
        placeholder="Enter food name"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.input}>
        <Picker
          selectedValue={category}
          style={{ height: 60 }}
          onValueChange={setCategory}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Expiration Date</Text>
      <View style={styles.dateContainer}>
        <TextInput
          style={[styles.input, styles.dayInput]}
          keyboardType="numeric"
          value={day}
          onChangeText={(text) => /^\d*$/.test(text) && setDay(text)}
          placeholder="Day"
          maxLength={2}
        />

        <View style={styles.picker}>
          <Picker
            selectedValue={month}
            onValueChange={setMonth}
          >
            {months.map((m) => (
              <Picker.Item key={m.value} label={m.name} value={m.value} />
            ))}
          </Picker>
        </View>

        <View style={styles.picker}>
          <Picker
            selectedValue={year}
            onValueChange={setYear}
          >
            {years.map((y) => (
              <Picker.Item key={y} label={y.toString()} value={y} />
            ))}
          </Picker>
        </View>
      </View>

      {dateError && <Text style={styles.errorText}>{dateError}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Updating...' : 'Update Product'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Reuse the same styles from add page
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#ddd',
    borderRadius: 12,
    paddingInline: 6,
    fontSize: 16,
  },
  nameInput: {
    backgroundColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    height: 50,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayInput: {
    width: '25%',
    textAlign: 'center',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: '35%',
    height: 60,
    backgroundColor: '#ddd',
    borderRadius: 10
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
});