import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabs from './src/navigation/BottomTabs';

export default function App() {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
        <StatusBar style="auto" />
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}
