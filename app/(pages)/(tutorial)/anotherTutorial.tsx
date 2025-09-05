import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Example, WordTypeExplanation, WordTypes } from '@/constants/WordTypeDefinitions';
import PageWrapper from '@/components/PageWrapper';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedExample = React.memo(({ example, index, delay = 0, type, parentType }: { example: Example, index: number, delay?: number, type: WordTypeExplanation, parentType?: WordTypeExplanation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [delay, fadeAnim, slideAnim]);

  // Safe string manipulation with null checks
  const sentence = example?.sentence || '';
  const highlightedSection = example?.highlightedSection || '';
  
  // Find the highlighted section and split the sentence correctly
  const highlightIndex = sentence.indexOf(highlightedSection);
  const beforeHighlight = highlightIndex > -1 ? sentence.substring(0, highlightIndex) : sentence;
  const afterHighlight = highlightIndex > -1 && highlightedSection ? 
    sentence.substring(highlightIndex + highlightedSection.length) : '';

  const textColor = type.color || parentType?.color || '#4A90E2'

  return (
    <Animated.View 
      style={[
        styles.exampleItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <ThemedText style={styles.exampleSentence}>
        {beforeHighlight}
        {highlightedSection && (
          <ThemedText style={[styles.highlightedText, {
          color: textColor, 
          backgroundColor: `${textColor}4D` // 4D is hex for 0.3 alpha
          }]}>
          {highlightedSection}
          </ThemedText>
        )}
        {afterHighlight}
      </ThemedText>
      {example?.explanation && (
        <ThemedText style={styles.exampleExplanation}>
          {example.explanation}
        </ThemedText>
      )}
    </Animated.View>
  );
});

// Separate component for bullet points
const AnimatedBulletPoint = React.memo(({ text, delay = 0, isVisible }: { text: string, delay?: number, isVisible: boolean }) => {
  const bulletFadeAnim = useRef(new Animated.Value(0)).current;
  const bulletSlideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(bulletFadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bulletSlideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ])
      ]).start();
    } else {
      bulletFadeAnim.setValue(0);
      bulletSlideAnim.setValue(20);
    }
  }, [isVisible, delay, bulletFadeAnim, bulletSlideAnim]);

  return (
    <Animated.View 
      style={[
        styles.bulletPoint,
        {
          opacity: bulletFadeAnim,
          transform: [{ translateX: bulletSlideAnim }]
        }
      ]}
    >
      <ThemedText style={styles.bullet}>•</ThemedText>
      <ThemedText style={styles.explanationText}>{text}</ThemedText>
    </Animated.View>
  );
});

// Separate component for word type cards
export const WordTypeCard = React.memo(({ wordType, index, expandedItems, onToggleExpanded }: { 
  wordType: any, 
  index: number, 
  expandedItems: Set<string>, 
  onToggleExpanded: (key: string) => void 
}) => {
  const mainKey = `main-${index}`;
  const isMainExpanded = expandedItems.has(mainKey);
  
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(50)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  // Initial card entrance animation
  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.timing(cardFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [index, cardFadeAnim, cardSlideAnim]);

  // Handle expand/collapse animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: isMainExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotationAnim, {
        toValue: isMainExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [isMainExpanded, expandAnim, rotationAnim]);

  const handlePress = useCallback(() => {
    // Press animation
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
    
    onToggleExpanded(mainKey);
  }, [mainKey, onToggleExpanded, scaleAnim]);

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.wordTypeContainer,
        {
          opacity: cardFadeAnim,
          transform: [
            { translateY: cardSlideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <AnimatedTouchableOpacity
        style={[styles.wordTypeHeader, { backgroundColor: wordType.color || '#4A90E2' }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.wordTypeName}>{wordType.name?.toUpperCase() || ''}</ThemedText>
            {wordType.abbr && (
              <Animated.View style={[
                styles.abbrBadge,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}>
                <ThemedText style={styles.abbrText}>{wordType.abbr}</ThemedText>
              </Animated.View>
            )}
          </View>
          {wordType.type && (
            <ThemedText style={styles.wordTypeCategory}>{wordType.type}</ThemedText>
          )}
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <MaterialIcons name="expand-more" size={24} color="white" />
        </Animated.View>
      </AnimatedTouchableOpacity>

      {isMainExpanded && (
        <Animated.View 
          style={[
            styles.expandedContent,
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
          {/* Main explanations */}
          {wordType.explanation && Array.isArray(wordType.explanation) && wordType.explanation.length > 0 && (
            <View style={styles.explanationSection}>
              {wordType.explanation.map((exp: string, expIndex: number) => (
                <AnimatedBulletPoint
                  key={expIndex}
                  text={exp}
                  delay={expIndex * 100}
                  isVisible={isMainExpanded}
                />
              ))}
            </View>
          )}

          {/* Highlighted explanations */}
          {wordType.highlitedExplanation && Array.isArray(wordType.highlitedExplanation) && wordType.highlitedExplanation.length > 0 && (
            <Animated.View 
              style={[
                styles.highlightedSection,
                {
                  opacity: expandAnim,
                  transform: [{
                    scale: expandAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    })
                  }]
                }
              ]}
            >
              {wordType.highlitedExplanation.map((exp: string, expIndex: number) => (
                <ThemedText key={expIndex} style={styles.highlightedExplanation}>
                  ⚠️ {exp}
                </ThemedText>
              ))}
            </Animated.View>
          )}

          {/* Direct examples */}
          {wordType.examples && Array.isArray(wordType.examples) && wordType.examples.length > 0 && (
            <View style={styles.examplesSection}>
              <ThemedText style={styles.sectionTitle}>Příklady:</ThemedText>
              {wordType.examples.map((example: any, exIndex: number) => (
                <AnimatedExample
                  key={exIndex}
                  example={example}
                  index={exIndex}
                  delay={exIndex * 150}
                  type={wordType}
                />
              ))}
            </View>
          )}

          {/* Types/Subtypes */}
          {wordType.types && Array.isArray(wordType.types) && wordType.types.length > 0 && 
            wordType.types.map((type: any, typeIndex: number) => (
              <SubTypeCard
                key={typeIndex}
                type={type}
                parentIndex={index}
                typeIndex={typeIndex}
                expandedItems={expandedItems}
                onToggleExpanded={onToggleExpanded}
                parentColor={wordType.color}
                parentType={wordType}
              />
            ))
          }
        </Animated.View>
      )}
    </Animated.View>
  );
});

// Separate component for subtypes
const SubTypeCard = React.memo(({ type, parentIndex, typeIndex, expandedItems, onToggleExpanded, parentColor, parentType }: {
  type: WordTypeExplanation,
  parentIndex: number,
  typeIndex: number,
  expandedItems: Set<string>,
  onToggleExpanded: (key: string) => void,
  parentColor?: string,
  parentType: WordTypeExplanation
}) => {
  const typeKey = `type-${parentIndex}-${typeIndex}`;
  const isTypeExpanded = expandedItems.has(typeKey);
  
  const subScaleAnim = useRef(new Animated.Value(1)).current;
  const subExpandAnim = useRef(new Animated.Value(0)).current;
  const subRotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(subExpandAnim, {
        toValue: isTypeExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(subRotationAnim, {
        toValue: isTypeExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [isTypeExpanded, subExpandAnim, subRotationAnim]);

  const handleSubPress = useCallback(() => {
    Animated.sequence([
      Animated.timing(subScaleAnim, {
        toValue: 0.98,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(subScaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      })
    ]).start();
    
    onToggleExpanded(typeKey);
  }, [typeKey, onToggleExpanded, subScaleAnim]);

  const subRotateInterpolate = subRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.subTypeContainer,
        {
          transform: [{ scale: subScaleAnim }]
        }
      ]}
    >
      <AnimatedTouchableOpacity
        style={[styles.subTypeHeader, { backgroundColor: type.color || parentColor || '#4A90E2' }]}
        onPress={handleSubPress}
        activeOpacity={0.8}
      >
        <View style={styles.subHeaderContent}>
          <ThemedText style={styles.subTypeName}>{type.name || ''}</ThemedText>
          {type.abbr && (
            <View style={styles.subAbbrBadge}>
              <ThemedText style={styles.subAbbrText}>{type.abbr}</ThemedText>
            </View>
          )}
        </View>
        <Animated.View style={{ transform: [{ rotate: subRotateInterpolate }] }}>
          <MaterialIcons name="expand-more" size={20} color="white" />
        </Animated.View>
      </AnimatedTouchableOpacity>

      {isTypeExpanded && (
        <Animated.View 
          style={[
            styles.subExpandedContent,
            {
              opacity: subExpandAnim,
              transform: [{
                scaleY: subExpandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }]
            }
          ]}
        >
          {type.explanation && Array.isArray(type.explanation) && type.explanation.length > 0 && (
            <View style={styles.explanationSection}>
              {type.explanation.map((exp: string, expIndex: number) => (
                <AnimatedBulletPoint
                  key={expIndex}
                  text={exp}
                  delay={expIndex * 100}
                  isVisible={isTypeExpanded}
                />
              ))}
            </View>
          )}

          {type.examples && Array.isArray(type.examples) && type.examples.length > 0 && (
            <View style={styles.examplesSection}>
              <ThemedText style={styles.sectionTitle}>Příklady:</ThemedText>
              {type.examples.map((example: any, exIndex: number) => (
                <AnimatedExample
                  key={exIndex}
                  example={example}
                  index={exIndex}
                  delay={exIndex * 100}
                  type={type}
                  parentType={parentType}
                />
              ))}
            </View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
});

export default function GrammarDefinitionsPage() {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((key: string) => {
    // Configure layout animation for smooth expand/collapse
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleY,
        springDamping: 0.7,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    setExpandedItems(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
      } else {
        newExpanded.add(key);
      }
      return newExpanded;
    });
  }, []);

  return (
    <PageWrapper>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <ThemedText style={styles.heading}>Definice větných členů</ThemedText>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.introSection}>
          <ThemedText style={styles.introText}>
            Zde najdete přehled všech větných členů s jejich definicemi, příklady a vysvětleními.
          </ThemedText>
        </View>

        {WordTypes && Array.isArray(WordTypes) && WordTypes.map((wordType, index) => (
          <WordTypeCard
            key={index}
            wordType={wordType}
            index={index}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
          />
        ))}
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
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  introSection: {
    backgroundColor: '#1c1f3d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  introText: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  wordTypeContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  wordTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordTypeName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  abbrBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  abbrText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  wordTypeCategory: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  expandedContent: {
    backgroundColor: '#1c1f3d',
    padding: 16,
  },
  explanationSection: {
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    color: '#4A90E2',
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  explanationText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  highlightedSection: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  highlightedExplanation: {
    color: '#FFC107',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  examplesSection: {
    marginTop: 8,
  },
  sectionTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  exampleItem: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exampleSentence: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 18,
  },
  highlightedText: {
    fontWeight: 'bold',
    paddingHorizontal: 2,
    borderRadius: 3,
  },
  exampleExplanation: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
  subTypeContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  subTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
    opacity: 0.9,
  },
  subHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  subTypeName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subAbbrBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  subAbbrText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  subExpandedContent: {
    backgroundColor: 'rgba(28, 31, 61, 0.8)',
    padding: 12,
  },
});