import React from 'react';
// import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PlayfulButton from '../PlayfulButton';

const ContinueButton = ({ onClick, enabled }: { onClick: () => void, enabled: boolean }) => {
  return (
    <PlayfulButton onPress={onClick} title='POTVRDIT' disabled={!enabled} />
  );
};

export default ContinueButton;