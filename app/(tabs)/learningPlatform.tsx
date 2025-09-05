import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import PageWrapper from '@/components/PageWrapper';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { useTutorialContext } from '@/contexts/TutorialContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Tutorial card component with animations
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

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [delay, fadeAnim, slideAnim]);

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
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
        <View style={styles.cardIcon}>
          <MaterialIcons name={icon as any} size={32} color="white" />
        </View>
        <View style={styles.cardContent}>
          <ThemedText style={styles.cardTitle}>{title}</ThemedText>
          <ThemedText style={styles.cardDescription}>{description}</ThemedText>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={20} color="rgba(255,255,255,0.6)" />
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
});

// Expandable section for Tutorial 3 variations
const Tutorial3Section = React.memo(({ onNavigate }: { onNavigate: (route: string) => void }) => {

  const { setSentence } = useTutorialContext();

  const [isExpanded, setIsExpanded] = useState(true);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const tutorialSentence1: WordSelectionOption[] = [
    { text: "Bílá", type: "pks" },
    { text: "kočka", type: "po" },
    { text: "s flíčky", type: "pkn" },
    { text: "ulovila", type: "př" },
    { text: "myš", type: "pt" }
  ]

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
  ]

  // Sample tutorial 3 variations - you can modify these based on your needs
  const tutorial3Variations = [
    { sentence: tutorialSentence1, title: 'Základní cvičení', description: 'Jednoduchá cvičení pro začátečníky' },
    { sentence: tutorialSentence2, title: 'Pokročilá cvičení', description: 'Složitější úkoly pro pokročilé' },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotationAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [isExpanded, expandAnim, rotationAnim]);

  const handleToggle = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
    
    setIsExpanded(!isExpanded);
  }, [isExpanded, scaleAnim]);

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={[styles.tutorial3Section, { transform: [{ scale: scaleAnim }] }]}>
      <AnimatedTouchableOpacity
        style={styles.tutorial3Header}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <View style={styles.tutorial3HeaderContent}>
          <View style={styles.tutorial3Icon}>
            <MaterialIcons name="psychology" size={32} color="white" />
          </View>
          <View style={styles.tutorial3TextContent}>
            <ThemedText style={styles.tutorial3Title}>Ukázkové věty</ThemedText>
          </View>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <MaterialIcons name="expand-more" size={24} color="white" />
        </Animated.View>
      </AnimatedTouchableOpacity>

      {isExpanded && (
        <Animated.View
          style={[
            styles.variationsContainer,
            {
              opacity: expandAnim,
              transform: [{
                scaleY: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }]
            }
          ]}
        >
          {tutorial3Variations.map((variation, index) => (
            <Animated.View
              key={index}
              style={[
                {
                  opacity: expandAnim,
                  transform: [{
                    translateX: expandAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity
                style={styles.variationItem}
                onPress={() => {
                  setSentence(variation.sentence);
                  onNavigate(`/(pages)/anotherFuckingTutorial`)
                }}
                activeOpacity={0.7}
              >
                <View style={styles.variationContent}>
                  <ThemedText style={styles.variationTitle}>{variation.title}</ThemedText>
                  <ThemedText style={styles.variationDescription}>{variation.description}</ThemedText>
                </View>
                <MaterialIcons name="play-arrow" size={20} color="#4A90E2" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
});

export default function TutorialNavigationPage() {
  const router = useRouter();

  const handleNavigate = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  return (
    <PageWrapper>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <ThemedText style={styles.heading}>Tutoriály</ThemedText>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.introSection}>
          <ThemedText style={styles.introText}>
            Vyberte si tutorial, který vás zajímá. Každý tutorial vás provede různými aspekty aplikace.
          </ThemedText>
        </View>

        <View style={styles.tutorialsContainer}>
          <TutorialCard
            title="Tutorial 1"
            description=""
            icon="start"
            onPress={() => handleNavigate('/(tutorial)/tutorial')}
            delay={100}
            variant="primary"
          />

          <TutorialCard
            title="Tutorial 2"
            description=""
            icon="settings"
            onPress={() => handleNavigate('/(tutorial)/anotherTutorial')}
            delay={200}
            variant="secondary"
          />

          <Tutorial3Section onNavigate={handleNavigate} />
        </View>
      </ScrollView>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101223',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    gap: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  heading: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  introSection: {
    backgroundColor: '#1c1f3d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  introText: {
    color: '#aaa',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  tutorialsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  tutorialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tutorialCardPrimary: {
    backgroundColor: '#4A90E2',
  },
  tutorialCardSecondary: {
    backgroundColor: '#7B68EE',
  },
  tutorialCardAccent: {
    backgroundColor: '#FF6B6B',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 18,
  },
  tutorial3Section: {
    backgroundColor: '#1c1f3d',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tutorial3Header: {
    backgroundColor: '#FF6B6B',
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
  tutorial3Icon: {
    marginRight: 16,
  },
  tutorial3TextContent: {
    flex: 1,
  },
  tutorial3Title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tutorial3Subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  variationsContainer: {
    padding: 16,
    backgroundColor: '#1c1f3d',
  },
  variationItem: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  variationContent: {
    flex: 1,
  },
  variationTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  variationDescription: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 18,
  },
  bottomSection: {
    alignItems: 'center',
    backgroundColor: '#1c1f3d',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bottomText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  homeButton: {
    marginVertical: 4,
  },
});