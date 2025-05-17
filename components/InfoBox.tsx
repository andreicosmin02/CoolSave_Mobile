import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoBoxProps {
  title: string;
  value: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    margin: 8,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default InfoBox;