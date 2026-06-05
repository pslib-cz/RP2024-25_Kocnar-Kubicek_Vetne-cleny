import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import PageWrapper from '@/components/PageWrapper';
import { ThemedText } from '@/components/ThemedText';
import PlayfulButton from '@/components/ui/PlayfulButton';
import { useLoadedData } from '@/hooks/useData';
import {
  buildDatasetSentenceIndex,
  DATASET_AREAS,
  DatasetSentenceEntry,
  DatasetWordEntry,
  FEEDBACK_CATEGORIES,
  FeedbackCategory,
  FeedbackCategoryId,
  searchDatasetEntries,
  sendFeedbackReport,
} from '@/utils/feedback/feedbackUtils';

type DatasetSelectionMode = 'search' | 'guided';

const FEEDBACK_WEBHOOK_URL = process.env.EXPO_PUBLIC_DISCORD_FEEDBACK_WEBHOOK_URL;

const appVersion =
  (Constants.expoConfig && typeof Constants.expoConfig === 'object' && 'version' in Constants.expoConfig && (Constants.expoConfig as any).version) ||
  (Constants.manifest2 && typeof Constants.manifest2 === 'object' && 'version' in Constants.manifest2 && (Constants.manifest2 as any).version) ||
  'neuvedeno';

function CategoryCard({
  category,
  selected,
  onPress,
}: {
  category: FeedbackCategory;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.categoryCard, selected && styles.categoryCardSelected]}
    >
      <View style={[styles.categoryIcon, selected && styles.categoryIconSelected]}>
        <MaterialIcons name={category.icon as any} size={22} color="#fff" />
      </View>
      <View style={styles.categoryTextWrap}>
        <ThemedText style={styles.categoryTitle}>{category.label}</ThemedText>
        <ThemedText style={styles.categoryDescription}>{category.description}</ThemedText>
      </View>
      {selected && <MaterialIcons name="check-circle" size={22} color="#8CC83C" />}
    </TouchableOpacity>
  );
}

function SegmentButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.segmentButton, selected && styles.segmentButtonSelected]}
    >
      <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

function AreaPill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.areaPill, selected && styles.areaPillSelected]}>
      <Text style={[styles.areaPillText, selected && styles.areaPillTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

function WordChip({
  word,
  selected,
  onPress,
}: {
  word: DatasetWordEntry;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.wordChip, selected && styles.wordChipSelected]}>
      <Text style={styles.wordChipText}>{word.text}</Text>
      <Text style={styles.wordTypeText}>{word.type}</Text>
    </TouchableOpacity>
  );
}

function SentenceCard({
  entry,
  selected,
  selectedWordIndex,
  onSelectSentence,
  onSelectWord,
}: {
  entry: DatasetSentenceEntry;
  selected: boolean;
  selectedWordIndex: number | null;
  onSelectSentence: () => void;
  onSelectWord: (word: DatasetWordEntry) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelectSentence}
      style={[styles.sentenceCard, selected && styles.sentenceCardSelected]}
    >
      <View style={styles.sentenceMetaRow}>
        <Text style={styles.sentenceMeta}>{entry.areaName}</Text>
        <Text style={styles.sentenceMeta}>#{entry.sentenceIndex + 1}</Text>
      </View>
      <Text style={styles.sentenceText}>{entry.sentenceText}</Text>
      {selected && (
        <View style={styles.wordChipWrap}>
          {entry.words.map((word) => (
            <WordChip
              key={`${entry.id}-${word.index}`}
              word={word}
              selected={selectedWordIndex === word.index}
              onPress={() => onSelectWord(word)}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

function SelectedDatasetCard({
  entry,
  word,
  onClear,
}: {
  entry: DatasetSentenceEntry;
  word: DatasetWordEntry | null;
  onClear: () => void;
}) {
  return (
    <View style={styles.selectedDatasetCard}>
      <View style={styles.selectedDatasetHeader}>
        <Text style={styles.selectedDatasetTitle}>Vybraná věta</Text>
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <MaterialIcons name="close" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.selectedDatasetText}>{entry.sentenceText}</Text>
      <Text style={styles.selectedDatasetMeta}>
        {entry.areaName}
        {word ? ` • ${word.text} (${word.type})` : ''}
      </Text>
    </View>
  );
}

export default function ReportIssuePage() {
  const router = useRouter();
  const { loadedSets, loadedVersion } = useLoadedData();
  const datasetEntries = useMemo(() => buildDatasetSentenceIndex(loadedSets), [loadedSets]);
  const availableAreas = useMemo(
    () => DATASET_AREAS.filter((area) => datasetEntries.some((entry) => entry.areaIndex === area.index)),
    [datasetEntries]
  );

  const [categoryId, setCategoryId] = useState<FeedbackCategoryId>('dataset-content');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [selectionMode, setSelectionMode] = useState<DatasetSelectionMode>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(availableAreas[0]?.index ?? 0);
  const [selectedEntry, setSelectedEntry] = useState<DatasetSentenceEntry | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedCategory = FEEDBACK_CATEGORIES.find((category) => category.id === categoryId) ?? FEEDBACK_CATEGORIES[0];
  const selectedWord = selectedEntry?.words.find((word) => word.index === selectedWordIndex) ?? null;
  const searchResults = useMemo(() => searchDatasetEntries(datasetEntries, searchQuery, 20), [datasetEntries, searchQuery]);
  const guidedEntries = useMemo(
    () => datasetEntries.filter((entry) => entry.areaIndex === selectedAreaIndex).slice(0, 60),
    [datasetEntries, selectedAreaIndex]
  );

  const resetDatasetSelection = () => {
    setSelectedEntry(null);
    setSelectedWordIndex(null);
  };

  const handleCategoryPress = (category: FeedbackCategory) => {
    setCategoryId(category.id);
    if (!category.needsDatasetSelection) {
      resetDatasetSelection();
    }
  };

  const handleSelectSentence = (entry: DatasetSentenceEntry) => {
    setSelectedEntry(entry);
    setSelectedWordIndex(null);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Chybí popis', 'Napiš prosím, co se stalo nebo co je špatně.');
      return;
    }

    setSubmitting(true);
    try {
      await sendFeedbackReport(FEEDBACK_WEBHOOK_URL, {
        categoryLabel: selectedCategory.label,
        message,
        contact,
        appVersion,
        datasetVersion: loadedVersion || 'neuvedeno',
        datasetSelection: selectedCategory.needsDatasetSelection && selectedEntry
          ? { entry: selectedEntry, word: selectedWord }
          : null,
      });

      Alert.alert('Odesláno', 'Děkujeme za hlášení.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Nepodařilo se odeslat hlášení', error instanceof Error ? error.message : 'Zkus to prosím znovu později.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios-new" size={20} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.heading}>Nahlásit problém</ThemedText>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>Kategorie</ThemedText>
            <View style={styles.categoryList}>
              {FEEDBACK_CATEGORIES.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  selected={category.id === categoryId}
                  onPress={() => handleCategoryPress(category)}
                />
              ))}
            </View>
          </View>

          {selectedCategory.needsDatasetSelection && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <ThemedText style={styles.sectionTitle}>Věta nebo slovo</ThemedText>
                <Text style={styles.optionalText}>volitelné</Text>
              </View>

              <View style={styles.segmentWrap}>
                <SegmentButton label="Vyhledat" selected={selectionMode === 'search'} onPress={() => setSelectionMode('search')} />
                <SegmentButton label="Podle části hry" selected={selectionMode === 'guided'} onPress={() => setSelectionMode('guided')} />
              </View>

              {selectionMode === 'search' ? (
                <View style={styles.datasetPickerBlock}>
                  <View style={styles.searchBox}>
                    <MaterialIcons name="search" size={20} color="#9BA1A6" />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Hledat větu, slovo nebo zkratku"
                      placeholderTextColor="#737892"
                      style={styles.searchInput}
                      autoCapitalize="none"
                    />
                  </View>

                  {searchQuery.trim().length > 0 && searchResults.length === 0 && (
                    <Text style={styles.emptyText}>Nic nenalezeno.</Text>
                  )}

                  {searchResults.map((entry) => (
                    <SentenceCard
                      key={entry.id}
                      entry={entry}
                      selected={selectedEntry?.id === entry.id}
                      selectedWordIndex={selectedWordIndex}
                      onSelectSentence={() => handleSelectSentence(entry)}
                      onSelectWord={(word) => {
                        setSelectedEntry(entry);
                        setSelectedWordIndex(word.index);
                      }}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.datasetPickerBlock}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.areaPillWrap}>
                    {availableAreas.map((area) => (
                      <AreaPill
                        key={area.index}
                        label={area.name}
                        selected={selectedAreaIndex === area.index}
                        onPress={() => {
                          setSelectedAreaIndex(area.index);
                          resetDatasetSelection();
                        }}
                      />
                    ))}
                  </ScrollView>

                  {guidedEntries.map((entry) => (
                    <SentenceCard
                      key={entry.id}
                      entry={entry}
                      selected={selectedEntry?.id === entry.id}
                      selectedWordIndex={selectedWordIndex}
                      onSelectSentence={() => handleSelectSentence(entry)}
                      onSelectWord={(word) => {
                        setSelectedEntry(entry);
                        setSelectedWordIndex(word.index);
                      }}
                    />
                  ))}
                </View>
              )}

              {selectedEntry && (
                <SelectedDatasetCard entry={selectedEntry} word={selectedWord} onClear={resetDatasetSelection} />
              )}
            </View>
          )}

          <View style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>Popis</ThemedText>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Co je špatně?"
              placeholderTextColor="#737892"
              style={styles.messageInput}
              multiline
              textAlignVertical="top"
            />

            <ThemedText style={[styles.sectionTitle, styles.contactTitle]}>Kontakt</ThemedText>
            <TextInput
              value={contact}
              onChangeText={setContact}
              placeholder="E-mail nebo jméno, volitelné"
              placeholderTextColor="#737892"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <PlayfulButton
            title={submitting ? 'Odesílám...' : 'Odeslat hlášení'}
            icon={submitting ? <ActivityIndicator size="small" color="#fff" /> : <MaterialIcons name="send" size={22} color="white" />}
            onPress={handleSubmit}
            disabled={submitting}
            style={styles.submitButton}
            variant="success"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  keyboardWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#101223',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionCard: {
    width: '100%',
    backgroundColor: '#1c1f3d',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  optionalText: {
    color: '#9BA1A6',
    fontSize: 13,
    marginBottom: 12,
  },
  categoryList: {
    gap: 10,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#262a4a',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#33395f',
  },
  categoryCardSelected: {
    borderColor: '#8A56E8',
    backgroundColor: '#2f315f',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A5BD2',
  },
  categoryIconSelected: {
    backgroundColor: '#8A56E8',
  },
  categoryTextWrap: {
    flex: 1,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryDescription: {
    color: '#b8bdd5',
    fontSize: 13,
    lineHeight: 18,
  },
  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: '#101223',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: '#5662e6',
  },
  segmentText: {
    color: '#b8bdd5',
    fontSize: 14,
    fontWeight: '700',
  },
  segmentTextSelected: {
    color: '#fff',
  },
  datasetPickerBlock: {
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101223',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#33395f',
    paddingHorizontal: 12,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 10,
    marginLeft: 8,
  },
  areaPillWrap: {
    gap: 10,
    paddingRight: 8,
  },
  areaPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: '#101223',
    borderWidth: 1,
    borderColor: '#33395f',
  },
  areaPillSelected: {
    backgroundColor: '#5662e6',
    borderColor: '#7580ff',
  },
  areaPillText: {
    color: '#c8cce4',
    fontWeight: '700',
  },
  areaPillTextSelected: {
    color: '#fff',
  },
  sentenceCard: {
    backgroundColor: '#262a4a',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#33395f',
  },
  sentenceCardSelected: {
    borderColor: '#57CC99',
  },
  sentenceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  sentenceMeta: {
    color: '#9BA1A6',
    fontSize: 12,
    fontWeight: '700',
  },
  sentenceText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 21,
  },
  wordChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  wordChip: {
    backgroundColor: '#101223',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#33395f',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  wordChipSelected: {
    borderColor: '#57CC99',
    backgroundColor: '#1f4a45',
  },
  wordChipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  wordTypeText: {
    color: '#9BA1A6',
    fontSize: 12,
    marginTop: 2,
  },
  selectedDatasetCard: {
    marginTop: 12,
    backgroundColor: '#143532',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#57CC99',
  },
  selectedDatasetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedDatasetTitle: {
    color: '#57CC99',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDatasetText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 21,
  },
  selectedDatasetMeta: {
    color: '#b8f0df',
    fontSize: 13,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#101223',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#33395f',
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  messageInput: {
    minHeight: 120,
    backgroundColor: '#101223',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#33395f',
    color: '#fff',
    fontSize: 15,
    lineHeight: 21,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  contactTitle: {
    marginTop: 18,
  },
  emptyText: {
    color: '#9BA1A6',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 12,
  },
  submitButton: {
    marginTop: 4,
  },
});
