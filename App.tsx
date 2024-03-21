import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import WordsScreen from './screens/WordsScreen';
import { firebaseConfig } from './firebase.config';
import TestScreen from './screens/TestScreen';
import { View, Text } from 'react-native';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import RegisterScreen from './screens/RegisterScreen';
import { ReactNode } from 'react';
import LoginScreen from './screens/LoginScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const app = initializeApp(firebaseConfig);

const Stack = createStackNavigator();

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default function App() {
	const [user, setUser] = useState<User>();
	const [initializing, setInitializing] = useState(true);

	const onAuthStateChangedHandler = (user: User) => {
		setUser(user);
		if (initializing) {
			setInitializing(false);
		}
	};

	useEffect(() => {
		//@ToDo Fix this TS error
		const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedHandler);

		return unsubscribe;
	}, []);

	if (initializing) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{!user ? (
					<>
						<Stack.Screen
							name='LoginScreen'
							component={LoginScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='RegisterScreen'
							component={RegisterScreen}
							options={{ headerShown: false }}
						/>
					</>
				) : (
					<Stack.Screen
						name='WordsScreen'
						component={WordsScreen}
						options={{ headerShown: false }}
					/>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
