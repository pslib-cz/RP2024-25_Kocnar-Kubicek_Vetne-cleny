import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";

export const useBackspaceIntercept = (onBackPress : () => void) => {
  const router = useRouter(); 

  useEffect(() => {
    const onBackPressCallback = () => {
      onBackPress();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPressCallback);

    return () => subscription.remove();
  }, [router]);  
}