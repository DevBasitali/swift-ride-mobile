// src/styles/GlobalStyles.js

import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  // --- LAYOUT & CONTAINERS ---
  screenContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7', // A light, neutral background
  },
  sectionPadding: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  
  // --- TYPOGRAPHY ---
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 24,
  },
  
  // --- BUTTONS & INTERACTIVE ELEMENTS ---
  primaryButton: {
    backgroundColor: '#4A90E2', // Your app's primary blue
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});