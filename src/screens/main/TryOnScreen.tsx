import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography } from '../../constants';

export default function TryOnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Virtual Try-On</Text>
        <Text style={styles.subtitle}>Experience fashion in AR</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...Typography.styles.h1, color: Colors.text.white },
  subtitle: { ...Typography.styles.body, color: Colors.text.white, marginTop: 16 },
});
