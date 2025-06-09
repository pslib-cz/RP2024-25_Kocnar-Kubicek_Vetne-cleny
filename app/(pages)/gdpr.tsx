import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Linking } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import PlayfulButton from '@/components/ui/PlayfulButton';
import AndroidSafeArea from '@/components/AndroidSafeArea';
import { useRouter } from 'expo-router';

const APP_NAME = 'Větná dráha';
const CONTACT_EMAIL = 'tomas.kubicek.022@pslib.cz';

export default function GDPRPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, AndroidSafeArea.AndroidSafeArea]}>
      <View style={styles.headerRow}>
        <PlayfulButton
          title="Zpět"
          variant="gray"
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <ThemedText style={styles.heading}>Zásady ochrany osobních údajů</ThemedText>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.infoBlock}>
          <ThemedText type="title" style={styles.title}>Zásady ochrany osobních údajů</ThemedText>
          <ThemedText style={styles.paragraph}>
            Tyto Zásady ochrany osobních údajů popisují, jakým způsobem {APP_NAME} (dále jen "my" nebo "Aplikace") shromažďuje, používá a sdílí informace o vás. Vaše soukromí je pro nás důležité a zavazujeme se chránit vaše osobní údaje v souladu s Obecným nařízením o ochraně osobních údajů (GDPR).
          </ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Jaké údaje shromažďujeme?</ThemedText>
          <ThemedText style={styles.paragraph}>
            Když používáte naši Aplikaci, shromažďujeme následující typy údajů:
          </ThemedText>
          <ThemedText style={styles.listItem}>Profilové údaje:</ThemedText>
          <ThemedText style={styles.listSubItem}>- Přezdívka/Jméno: Jméno, které si zvolíte pro svůj profil. Toto jméno slouží pouze jako vaše přezdívka v Aplikaci.</ThemedText>
          <ThemedText style={styles.listSubItem}>- Barva a tvar profilu: Vámi vybraná barva a tvar profilové rakety.</ThemedText>
          <ThemedText style={styles.listSubItem}>- Verze aplikace a datových sad: Informace o verzi aplikace a datových sad, které jsou stažené v Aplikaci.</ThemedText>
          <ThemedText style={styles.listItem}>Herní údaje:</ThemedText>
          <ThemedText style={styles.listSubItem}>- Data z online her: Informace o vašem průběhu ve hrách (úspěšnost, časy).</ThemedText>
          <ThemedText style={styles.listSubItem}>- Aktuální úroveň hráče: Vaše dosažená úroveň v Aplikaci.</ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Proč údaje shromažďujeme?</ThemedText>
          <ThemedText style={styles.paragraph}>
            Vaše údaje shromažďujeme z následujících důvodů:
          </ThemedText>
          <ThemedText style={styles.listItem}>- Propojení s učitelem a ostatními hráči: Aby učitelé a žáci ve stejné online hře mohli vidět váš herní profil, pokrok a aktivitu. Jméno (přezdívka) a barva profilové rakety slouží k vaší identifikaci v rámci online hry.</ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Jak jsou údaje ukládány a kdo k nim má přístup?</ThemedText>
          <ThemedText style={styles.paragraph}>
            Všechny shromážděné údaje jsou bezpečně uloženy na našem serveru.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            K vašim profilovým a herním údajům mají přístup učitelé, do jejichž online hry se připojíte. Údaje jsou jim zpřístupněny pouze za účelem sledování vašeho pokroku a usnadnění výuky v rámci jejich online hry.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            K vašim profilovým údajům mají přístup ostatní hráči v připojené hře. Údaje jsou jim zpřístupněny pouze za účelem identifikace aktivních hráčů v rámci hry.
          </ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Jak dlouho údaje uchováváme?</ThemedText>
          <ThemedText style={styles.paragraph}>
            Vaše údaje uchováváme po dobu, po kterou máte aktivní účet v Aplikaci. Pokud se rozhodnete svůj účet smazat, vaše osobní údaje budou z našich systémů smazány v přiměřené lhůtě, s výjimkou údajů, které musíme uchovávat ze zákonných důvodů. Pro smazání účtu nás kontaktujte na níže uvedený e-mail.
          </ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Jaká jsou vaše práva?</ThemedText>
          <ThemedText style={styles.paragraph}>
            Podle GDPR máte ve vztahu ke svým osobním údajům následující práva:
          </ThemedText>
          <ThemedText style={styles.listItem}>- Právo na přístup: Máte právo získat potvrzení, zda jsou vaše osobní údaje zpracovávány, a pokud ano, máte právo k nim získat přístup.</ThemedText>
          <ThemedText style={styles.listItem}>- Právo na opravu: Máte právo požádat o opravu nepřesných nebo neúplných osobních údajů.</ThemedText>
          <ThemedText style={styles.listItem}>- Právo na výmaz ("právo být zapomenut"): Máte právo požádat o vymazání vašich osobních údajů, pokud pro to existují zákonné důvody (např. údaje již nejsou potřebné pro účely, pro které byly shromážděny).</ThemedText>
          <ThemedText style={styles.listItem}>- Právo na omezení zpracování: Máte právo požádat o omezení zpracování vašich osobních údajů za určitých podmínek.</ThemedText>
          <ThemedText style={styles.listItem}>- Právo na přenositelnost údajů: Máte právo získat své osobní údaje ve strukturovaném, běžně používaném a strojově čitelném formátu a předat je jinému správci.</ThemedText>
          <ThemedText style={styles.listItem}>- Právo vznést námitku: Máte právo vznést námitku proti zpracování vašich osobních údajů za určitých podmínek.</ThemedText>
          <ThemedText style={styles.listItem}>- Právo podat stížnost: Pokud se domníváte, že zpracování vašich osobních údajů porušuje GDPR, máte právo podat stížnost u dozorového úřadu (v České republice Úřad pro ochranu osobních údajů).
          </ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Kontaktujte nás</ThemedText>
          <ThemedText style={styles.paragraph}>
            Pokud máte jakékoli dotazy ohledně těchto Zásad ochrany osobních údajů nebo zpracování vašich osobních údajů, neváhejte nás kontaktovat na níže uvedený e-mail.
          </ThemedText>
          <PlayfulButton
            title={CONTACT_EMAIL}
            variant="gray"
            onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
            style={styles.contactButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101223',
  },
  container: {
    flex: 1,
    backgroundColor: '#101223',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
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
  heading: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 16,
  },
  infoBlock: {
    width: '100%',
    backgroundColor: '#1c1f3d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  paragraph: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },
  listItem: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 6,
  },
  listSubItem: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 24,
    marginBottom: 4,
  },
  contactButton: {
    marginTop: 16,
    width: '100%',
  },
  backButton: {
    width: 100,
    marginRight: 12,
  },
});
