import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

export default function LibraryScreen() {
  const [vibes, setVibes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadVibes = useCallback(async () => {
    const { data, error } = await supabase
      .from('vibes')
      .select('id,prompt,image')
      .order('id', { ascending: false });

    if (!error && data) {
      setVibes(data);
    }
  }, []);

  useEffect(() => {
    loadVibes();
  }, [loadVibes]);

  async function onRefresh() {
    setRefreshing(true);
    await loadVibes();
    setRefreshing(false);
  }

  return (
    <LinearGradient colors={['#081966', '#4D1A98', '#D114D3']} style={styles.container}>
      <View style={styles.headerWrap}>
        <Text style={styles.hello}>Hello, User!</Text>
        <Text style={styles.title}>Your Created Vibes</Text>
      </View>

      <FlatList
        data={vibes}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listPad}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrap: { padding: 16 },
  hello: { color: '#fff', fontSize: 44, fontWeight: '800' },
  title: { color: '#fff', fontSize: 42, fontWeight: '700' },
  listPad: { paddingHorizontal: 12, paddingBottom: 120 },
  row: { justifyContent: 'space-between' },
  itemBox: { width: '31%', aspectRatio: 1, marginBottom: 10 },
  itemImage: { width: '100%', height: '100%', borderRadius: 12 }
});
