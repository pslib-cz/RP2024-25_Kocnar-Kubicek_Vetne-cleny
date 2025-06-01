import { useLevelContext } from "@/contexts/levelContext";
import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Tooltip } from "./Tooltip";
import WordButton from "./WordButton";

export const TargetTypeDisplay = ({ text }: { text: string }) => {
  const { targetType, tooltip, handleHideTooltip, handleShowTooltip } = useLevelContext();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{text}</Text>
      </View>
      <View style={{justifyContent: 'flex-start'}}>
        {
          targetType &&
          <Tooltip
            visible={tooltip.visible}
            message={tooltip.message}
            onRequestClose={handleHideTooltip}
            top={false}
          >
            <WordButton
              text={targetType.text}
              state={targetType.state}
              type={targetType.type}
              drawType={targetType.drawType}
              onLongPress={() => handleShowTooltip(targetType.text, 0)}
              onClick={() => handleShowTooltip(targetType.text, 0)}
            />
          </Tooltip>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 100,
    flexWrap: 'wrap',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  wrapper: {
    // flexGrow: 1,
    // display: 'flex',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignItems: 'center',
    // gap: 20,
    // justifyContent: 'center',
  }
});