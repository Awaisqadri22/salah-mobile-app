import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FineScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fine</Text>
      <Text style={styles.subtitle}>Fine summary will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
});
