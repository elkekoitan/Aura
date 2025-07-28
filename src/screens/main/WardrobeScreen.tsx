import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography } from '../../constants';

export default function WardrobeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.light}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.content}>
        <Text style={styles.title}>My Wardrobe</Text>
        <Text style={styles.subtitle}>Your digital fashion collection</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...Typography.styles.h1, color: Colors.text.primary },
  subtitle: { ...Typography.styles.body, color: Colors.text.secondary, marginTop: 16 },
});
