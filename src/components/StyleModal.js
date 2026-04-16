import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { generateVibeImage } from '../lib/bytz';
import { supabase } from '../lib/supabase';

export default function StyleModal({ visible, selectedStyle, onClose, onCreated }) {
  const [localImage, setLocalImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow media library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      base64: true
    });

    if (!result.canceled) {
      setLocalImage(result.assets[0]);
    }
  }

  async function onGenerate() {
    if (!selectedStyle || !localImage) {
      Alert.alert('Missing data', 'Select style and upload your image first.');
      return;
    }

    setLoading(true);
    try {
      const prompt = selectedStyle.prompt;
      const imageUrl = await generateVibeImage({ prompt, imageBase64: localImage.base64 });

      const { error } = await supabase.from('vibes').insert({
        prompt,
        image: imageUrl
      });

      if (error) throw error;

      onCreated();
      onClose();
      setLocalImage(null);
    } catch (error) {
      Alert.alert('Generate failed', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Pressable onPress={onClose} style={styles.close}><Text style={styles.closeText}>✕</Text></Pressable>
          <Text style={styles.title}>SELECTED STYLE: {selectedStyle?.name?.toUpperCase()}</Text>
          <Image source={{ uri: selectedStyle?.image }} style={styles.preview} />

          <Pressable style={styles.uploadBox} onPress={pickImage}>
            {localImage ? (
              <Image source={{ uri: localImage.uri }} style={styles.uploadPreview} />
            ) : (
              <Text style={styles.uploadText}>Tap to add your image</Text>
            )}
          </Pressable>

          <Pressable style={styles.generateBtn} onPress={onGenerate}>
            <Text style={styles.generateText}>{loading ? 'Generating...' : 'GENERATE'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#241B72',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    minHeight: 500
  },
  close: { alignSelf: 'flex-end' },
  closeText: { fontSize: 30, color: '#fff' },
  title: { color: '#fff', fontWeight: '800', fontSize: 28, marginBottom: 12 },
  preview: { width: 190, height: 190, borderRadius: 16, alignSelf: 'center', marginBottom: 20 },
  uploadBox: {
    height: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#8178D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18
  },
  uploadText: { color: '#B7B0E8', fontSize: 20 },
  uploadPreview: { width: '100%', height: '100%', borderRadius: 12 },
  generateBtn: {
    height: 60,
    borderRadius: 30,
    backgroundColor: '#18AEFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  generateText: { color: '#fff', fontWeight: '800', fontSize: 30 }
});
