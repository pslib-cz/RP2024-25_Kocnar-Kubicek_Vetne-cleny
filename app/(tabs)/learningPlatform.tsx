import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import PageWrapper from '@/components/PageWrapper';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { useTutorialContext } from '@/contexts/TutorialContext';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Enhanced tutorial card with better gradients and hover effects
const TutorialCard = React.memo(({ 
  title, 
  description, 
  icon, 
  onPress, 
  delay = 0,
  variant = 'primary'
}: {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  delay?: number;
  variant?: 'primary' | 'secondary' | 'accent';
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ])
    ]).start();

    // Subtle shimmer effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [delay, fadeAnim, slideAnim, shimmerAnim]);

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
    onPress();
  }, [onPress, scaleAnim]);

  const getCardStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.tutorialCardSecondary;
      case 'accent':
        return styles.tutorialCardAccent;
      default:
        return styles.tutorialCardPrimary;
    }
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width]
  });

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <AnimatedTouchableOpacity
        style={[styles.tutorialCard, getCardStyle()]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Shimmer overlay */}
        <Animated.View 
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX: shimmerTranslate }]
            }
          ]} 
        />
        
        <View style={styles.cardIconContainer}>
          <View style={styles.cardIcon}>
            <MaterialIcons name={icon as any} size={28} color="white" />
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <ThemedText style={styles.cardTitle}>{title}</ThemedText>
          <ThemedText style={styles.cardDescription}>{description}</ThemedText>
          <View style={styles.cardProgress}>
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={[styles.progressDot, styles.progressDotInactive]} />
          </View>
        </View>
        
        <View style={styles.cardArrow}>
          <MaterialIcons name="arrow-forward-ios" size={18} color="rgba(255,255,255,0.7)" />
        </View>
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
});

// Enhanced tutorial section with glow effects (always expanded)
const Tutorial3Section = React.memo(({ onNavigate }: { onNavigate: (route: string) => void }) => {
  const { setSentence } = useTutorialContext();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const tutorialSentence1: WordSelectionOption[] = [
    { text: "Bílá", type: "pks" },
    { text: "kočka", type: "po" },
    { text: "s flíčky", type: "pkn" },
    { text: "ulovila", type: "př" },
    { text: "myš", type: "pt" }
  ];

  const tutorialSentence2: WordSelectionOption[] = [
    { text: "Bílá", type: "pks" },
    { text: "kočka", type: "po" },
    { text: "s flíčky", type: "pkn" },
    { text: "včera", type: "puč" },
    { text: "na zahradě", type: "pum" },
    { text: "z hladu", type: "pu příčiny" },
    { text: "velmi", type: "pu míry" },
    { text: "obratně", type: "puz" },
    { text: "ulovila", type: "př" },
    { text: "myš", type: "pt" }
  ];

  const tutorial3Variations = [
    { sentence: tutorialSentence1, title: 'Jednoduchá věta', description: 'Obsahuje pouze základní větné členy', color: '#4CAF50' },
    { sentence: tutorialSentence2, title: 'Pokročilá věta', description: 'Obsahuje všechny větné členy', color: '#FF9800' },
  ];

  useEffect(() => {
    // Subtle glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7]
  });

  return (
    <Animated.View style={[styles.tutorial3Section, { transform: [{ scale: scaleAnim }] }]}>
      <Animated.View 
        style={[
          styles.sectionGlow,
          { opacity: glowOpacity }
        ]} 
      />
      
      <View
        style={styles.tutorial3Header}
      >
        <View style={styles.tutorial3HeaderContent}>
          <View style={styles.tutorial3IconContainer}>
            <View style={styles.tutorial3Icon}>
              <MaterialIcons name="psychology" size={28} color="white" />
            </View>
          </View>
          <View style={styles.tutorial3TextContent}>
            <ThemedText style={styles.tutorial3Title}>Ukázkové věty</ThemedText>
            <ThemedText style={styles.tutorial3Subtitle}>
              určování větných členů, krok za krokem
            </ThemedText>
          </View>
        </View>
      </View>

      <View
        style={styles.variationsContainer}
      >
        {tutorial3Variations.map((variation, index) => (
          <View
            key={index}
          >
            <TouchableOpacity
              style={styles.variationItem}
              onPress={() => {
                setSentence(variation.sentence);
                onNavigate(`/(pages)/anotherFuckingTutorial`)
              }}
              activeOpacity={0.7}
            >
              <View style={styles.variationIconContainer}>
                <View style={[styles.difficultyIndicator, { backgroundColor: variation.color }]} />
              </View>
              <View style={styles.variationContent}>
                <View style={styles.variationHeader}>
                  <ThemedText style={styles.variationTitle}>{variation.title}</ThemedText>
                </View>
                <ThemedText style={styles.variationDescription}>{variation.description}</ThemedText>
              </View>
              <View style={styles.variationArrow}>
                <MaterialIcons name="play-circle-outline" size={24} color="#4A90E2" />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </Animated.View>
  );
});

export default function TutorialNavigationPage() {
  const router = useRouter();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const { setSentence } = useTutorialContext();

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [headerAnim]);

  const handleNavigate = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  return (
    <PageWrapper>
      <Animated.View 
        style={[
          styles.headerRow,
          {
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }]
          }
        ]}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <ThemedText style={styles.heading}>Výuka</ThemedText>
      </Animated.View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tutorialsContainer}>
          <Tutorial3Section onNavigate={handleNavigate} />

          <TutorialCard
            title="Asistováné určování"
            description="určování pomocí ano/nebo otázek"
            icon="play-circle-outline"
            onPress={() => {
              handleNavigate('/(tutorial)/tutorial')
              setSentence(null);
            }}
            delay={200}
            variant="primary"
          />

          <TutorialCard
            title="Seznam větných členů"
            description="Kompletní přehled všech větných členů"
            icon="settings"
            onPress={() => handleNavigate('/(tutorial)/anotherTutorial')}
            delay={300}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D1F',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(16, 18, 35, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 144, 226, 0.1)',
  },
  backButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    marginRight: 16,
  },
  heading: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    flex: 1,
    letterSpacing: -0.5,
  },
  introSection: {
    backgroundColor: 'linear-gradient(135deg, #1E2347 0%, #252B5C 100%)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
  },
  introIconContainer: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  introText: {
    color: '#B8C1EC',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  introStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#4A90E2',
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: '#8892B0',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    marginHorizontal: 20,
  },
  tutorialsContainer: {
    gap: 20,
    marginBottom: 32,
  },
  tutorialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  tutorialCardPrimary: {
    backgroundColor: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
  },
  tutorialCardSecondary: {
    backgroundColor: 'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)',
  },
  tutorialCardAccent: {
    backgroundColor: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 50,
    transform: [{ skewX: '-20deg' }],
  },
  cardIconContainer: {
    marginRight: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardProgress: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  progressDotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardArrow: {
    marginLeft: 12,
    padding: 8,
  },
  tutorial3Section: {
    backgroundColor: '#1E2347',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    position: 'relative',
  },
  sectionGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 22,
    zIndex: -1,
  },
  tutorial3Header: {
    backgroundColor: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  tutorial3HeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tutorial3IconContainer: {
    marginRight: 16,
  },
  tutorial3Icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorial3TextContent: {
    flex: 1,
  },
  tutorial3Title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  tutorial3Subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  variationsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1E2347',
    overflow: 'hidden',
  },
  variationItem: {
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.15)',
  },
  variationIconContainer: {
    marginRight: 12,
  },
  difficultyIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  variationContent: {
    flex: 1,
  },
  variationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  variationTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
    letterSpacing: -0.2,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '500',
  },
  variationDescription: {
    color: '#B8C1EC',
    fontSize: 14,
    lineHeight: 18,
  },
  variationArrow: {
    marginLeft: 12,
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
  },
  footerText: {
    color: '#B8C1EC',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});