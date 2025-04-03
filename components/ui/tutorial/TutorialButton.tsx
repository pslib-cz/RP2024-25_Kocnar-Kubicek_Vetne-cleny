import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TutorialButton({title, filled, onPress} : {title : string, filled : boolean, onPress : () => void}) {
  return (
    <TouchableOpacity style={filled ? styles.buttonYes : styles.buttonNo} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonYes: {
    backgroundColor: '#3A3A9F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginRight: 10,
  },
  buttonNo: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFF',
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});