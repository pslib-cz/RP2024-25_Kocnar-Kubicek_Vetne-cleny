import { useLevelContext } from "@/contexts/levelContext";
import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Tooltip } from "./Tooltip";
import WordButton from "./WordButton";

export const TargetTypeDisplay = () => {

  const { targetType, tooltip, handleHideTooltip, handleShowTooltip } = useLevelContext();

  return(
    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Text style={styles.title}>Vyber</Text>
      {
        targetType &&
        <Tooltip
          visible={tooltip.visible}
          message={tooltip.message}
          onRequestClose={handleHideTooltip}
        >
          <WordButton
            text={targetType.text}
            state={targetType.state}
            type={targetType.type}
            drawType={targetType.drawType}
            onLongPress={() => handleShowTooltip(targetType.text, 0)}
            onClick={handleHideTooltip}
          />
        </Tooltip>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  grid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'space-between',
  }
});