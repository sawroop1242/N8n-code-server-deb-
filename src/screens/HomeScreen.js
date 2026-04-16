import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StyleModal from '../components/StyleModal';

const stylesData = [
  { id: '1', name: 'Photorealistic Viking', prompt: 'portrait in cinematic photorealistic viking style', image: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?w=500' },
  { id: '2', name: 'Cyberpunk Neon', prompt: 'portrait in cyberpunk neon style with magenta and blue lighting', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500' },
  { id: '3', name: 'Anime', prompt: 'portrait in anime style, clean shading, expressive eyes', image: 'https://images.unsplash.com/photo-1542204625-de293a5dff7c?w=500' },
  { id: '4', name: 'Film Star', prompt: 'vintage black and white film star portrait, dramatic studio light', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500' },
  { id: '5', name: 'Watercolor', prompt: 'watercolor portrait, pastel and soft brush texture', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500' },
  { id: '6', name: 'Comic Hero', prompt: 'comic-book hero portrait with halftone and dramatic shadows', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500' }
];

export default function HomeScreen() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const trending = useMemo(() => stylesData.slice(0, 4), []);
  const newStyles = useMemo(() => stylesData.slice(4), []);

  function openStyle(style) {
    setSelectedStyle(style);
    setShowModal(true);
  }

  return (
    <LinearGradient colors={['#081966', '#4D1A98', '#D114D3']} style={screenStyles.container}>
      <ScrollView contentContainerStyle={screenStyles.scroll}>
        <Text style={screenStyles.hello}>Hello, User!</Text>

        <Text style={screenStyles.sectionTitle}>Trending Styles</Text>
        <FlatList
          data={trending}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => openStyle(item)} style={screenStyles.card}>
              <Image source={{ uri: item.image }} style={screenStyles.cardImage} />
              <Text style={screenStyles.cardLabel}>{item.name}</Text>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={screenStyles.sectionTitle}>New Styles</Text>
        <FlatList
          data={newStyles}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => openStyle(item)} style={screenStyles.card}>
              <Image source={{ uri: item.image }} style={screenStyles.cardImage} />
              <Text style={screenStyles.cardLabel}>{item.name}</Text>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={screenStyles.sectionTitle}>All Styles</Text>
        <View style={screenStyles.grid}>
          {stylesData.map((item) => (
            <Pressable key={item.id} onPress={() => openStyle(item)} style={screenStyles.gridCard}>
              <Image source={{ uri: item.image }} style={screenStyles.gridImage} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <StyleModal
        visible={showModal}
        selectedStyle={selectedStyle}
        onClose={() => setShowModal(false)}
        onCreated={() => {}}
      />
    </LinearGradient>
  );
}

const screenStyles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 120 },
  hello: { color: '#fff', fontSize: 46, fontWeight: '800', marginBottom: 10 },
  sectionTitle: { color: '#fff', fontSize: 42, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  card: { width: 220, marginRight: 12 },
  cardImage: { width: 220, height: 130, borderRadius: 14 },
  cardLabel: { color: '#fff', marginTop: 6, fontSize: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: '31%', aspectRatio: 1, marginBottom: 10 },
  gridImage: { width: '100%', height: '100%', borderRadius: 12 }
});
