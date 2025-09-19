import React from 'react';
import { StyleSheet, ViewStyle, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#101223",
  }
});

type PageWrapperProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
};

const PageWrapper: React.FC<PageWrapperProps> = ({ children, style, padding }) => (
  <SafeAreaView style={[styles.safeArea, style, padding && { padding: 16 }]}>
    {children}
  </SafeAreaView>
);

export default PageWrapper;