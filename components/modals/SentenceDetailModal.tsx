import React, { useEffect, useRef, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { WordButtonsContainer } from '../ui/games/WordButtonsContainer';
import { useLevelContext } from '@/contexts/levelContext';
import { WordButtonType } from '@/types/games/WordButtonType';
import { ButtonState } from '../ui/games/WordButton';

interface SentenceDetailModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  sentence?: WordSelectionOption[] | null;
  closeButtonText?: string;
}

const SentenceDetailModal: React.FC<SentenceDetailModalProps> = ({
  visible,
  onClose,
  title = "Nápověda",
  sentence = undefined,
  closeButtonText = "Chápu",
}) => {
  const { handleShowTooltip, handleHideTooltip } = useLevelContext();
  const [buttons, setButtons] = useState<WordButtonType[]>([]);
  
  useEffect(() => {
    if (!sentence) return;

    setButtons(
      sentence.map((item) => ({
        text: item.text,
        type: item.type,
        drawType: true,
        state: ButtonState.default
      }))
    )      
  }, [sentence]);

  return (
    <ModalWrapper visible={visible} onClose={() => {
      onClose();
      handleHideTooltip();
    }} title={title} closeButtonText={closeButtonText} contentWrapperStyle={{ paddingTop: 56, paddingBottom: 12 }}>
      <WordButtonsContainer
        buttons={buttons}
        showTooltip={true}
        longPress={() => {}}
        onClick={(button, index) => handleShowTooltip(button.type || "null", index)}
      />
    </ModalWrapper>
  );
};

export default SentenceDetailModal;