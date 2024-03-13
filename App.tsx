import { initializeApp } from 'firebase/app';
import WordsScreen from './screens/WordsScreen';
import { firebaseConfig } from './firebase.config';
import TestScreen from './screens/TestScreen';
import { View } from 'react-native';

const app = initializeApp(firebaseConfig);

export default function App() {
	return <WordsScreen />;
}
