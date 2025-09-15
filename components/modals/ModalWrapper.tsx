import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView} from 'react-native';

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  closeButtonText?: string;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  onClose,
  title = "Nápověda",
  closeButtonText = "Zavřít",
  children
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [cachedTitle, setCachedTitle] = useState<string>(title);
  const [cachedCloseButtonText, setCachedCloseButtonText] = useState<string>(closeButtonText);
  const [cachedChildren, setCachedChildren] = useState<React.ReactNode | null>(null);

  // cache whole data, including the children, to avoid re-rendering when the visible is set to true
  useEffect(() => {
    if (visible) {      
      setCachedTitle(title);
      setCachedCloseButtonText(closeButtonText);
      setCachedChildren(children);
    }
  }, [visible, title, closeButtonText, children]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableOpacity 
        style={styles.overlayTouchable} 
        activeOpacity={1} 
        onPress={onClose}
      />
      
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{cachedTitle}</Text>
        </View>
        
        <View style={styles.contentWrapper}>
          <ScrollView 
            style={styles.contentScrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {cachedChildren}
          </ScrollView>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{cachedCloseButtonText}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999999, // the fact that 1000 does not work is disgusting
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '85%',
    maxHeight: '85%',
    backgroundColor: '#1c1f3d',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    backgroundColor: '#1c1f3d',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  contentWrapper: {
    maxHeight: '70%',
  },
  contentScrollView: {
    flexGrow: 0,
  },
  content: {
    padding: 20,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 100,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ModalWrapper;