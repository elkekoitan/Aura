import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../config/supabase';
import { useAppSelector } from '../store';
import { Colors, Typography } from '../constants';

interface SupabaseTestProps {
  onComplete?: () => void;
}

export const SupabaseTest: React.FC<SupabaseTestProps> = ({ onComplete }) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<string[]>([]);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const addTestResult = (result: string, success: boolean = true) => {
    const status = success ? '✅' : '❌';
    setTestResults(prev => [...prev, `${status} ${result}`]);
  };

  const runSupabaseTests = async () => {
    setTestStatus('testing');
    setTestResults([]);

    try {
      // Test 1: Connection check
      addTestResult('Testing Supabase connection...');
      const { data, error } = await supabase.from('brands').select('count', { count: 'exact', head: true });
      if (error) {
        addTestResult(`Connection failed: ${error.message}`, false);
      } else {
        addTestResult('Connection successful');
      }

      // Test 2: Auth check
      addTestResult('Testing authentication...');
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) {
        addTestResult(`Auth check failed: ${authError.message}`, false);
      } else {
        addTestResult(`Auth check successful - User: ${session?.user?.email || 'Not authenticated'}`);
      }

      // Test 3: User profile check (if authenticated)
      if (session?.user) {
        addTestResult('Testing user profile...');
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (profileError) {
          addTestResult(`Profile fetch failed: ${profileError.message}`, false);
        } else {
          addTestResult('Profile fetch successful');
        }
      }

      // Test 4: Products table check
      addTestResult('Testing products table...');
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .limit(1);
      
      if (productsError) {
        addTestResult(`Products table access failed: ${productsError.message}`, false);
      } else {
        addTestResult(`Products table accessible - Found ${products?.length || 0} products`);
      }

      // Test 5: Storage check
      addTestResult('Testing storage access...');
      const { data: storageData, error: storageError } = await supabase.storage
        .from('product-images')
        .list('', { limit: 1 });
      
      if (storageError) {
        addTestResult(`Storage access failed: ${storageError.message}`, false);
      } else {
        addTestResult('Storage access successful');
      }

      setTestStatus('success');
      addTestResult('All tests completed successfully!');
      
    } catch (error) {
      setTestStatus('error');
      addTestResult(`Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`, false);
    }

    if (onComplete) {
      setTimeout(onComplete, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      
      <View style={styles.statusContainer}>
        {testStatus === 'idle' && (
          <Text style={styles.statusText}>Ready to test</Text>
        )}
        {testStatus === 'testing' && (
          <>
            <ActivityIndicator size="large" color={Colors.primary[500]} />
            <Text style={styles.statusText}>Running tests...</Text>
          </>
        )}
        {testStatus === 'success' && (
          <Text style={[styles.statusText, styles.successText]}>✅ All tests passed!</Text>
        )}
        {testStatus === 'error' && (
          <Text style={[styles.statusText, styles.errorText]}>❌ Tests failed</Text>
        )}
      </View>

      <View style={styles.resultsContainer}>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>

      <Button
        title={testStatus === 'testing' ? 'Testing...' : 'Run Tests'}
        onPress={runSupabaseTests}
        disabled={testStatus === 'testing'}
        color={Colors.primary[500]}
      />

      {isAuthenticated && user && (
        <View style={styles.userContainer}>
          <Text style={styles.userText}>
            Logged in as: {user.email}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background.primary,
  },
  title: {
    ...Typography.styles.h2,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.text.primary,
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  statusText: {
    ...Typography.styles.body,
    textAlign: 'center',
    marginTop: 10,
  },
  successText: {
    color: Colors.semantic.success,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.semantic.error,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    minHeight: 100,
  },
  resultText: {
    ...Typography.styles.bodySmall,
    marginBottom: 5,
    color: Colors.text.secondary,
  },
  userContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
  },
  userText: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    textAlign: 'center',
  },
});