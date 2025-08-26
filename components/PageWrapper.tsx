import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { Platform, StatusBar } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "#101223",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});

type PageWrapperProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const PageWrapper: React.FC<PageWrapperProps> = ({ children, style }) => (
  <SafeAreaView style={[styles.safeArea, styles.AndroidSafeArea, style]}>
    {children}
  </SafeAreaView>
);

export default PageWrapper;