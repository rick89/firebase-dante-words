import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import WordsScreen from './screens/WordsScreen';
import { firebaseConfig } from './firebase.config';
import TestScreen from './screens/TestScreen';
import { View, Text } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import RegisterScreen from './screens/RegisterScreen';
import { ReactNode } from 'react';
import LoginScreen from './screens/LoginScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const Stack = createStackNavigator();

export default function App() {
	const [user, setUser] = useState();
	const [initializing, setInitializing] = useState(true);
	let view: ReactNode = <LoginScreen />;

	onAuthStateChanged(auth, (user) => {
		console.log('onAuthStateChanged', user);
		if (user) {
			const email = user.email;
			console.log('logged in with email', email);
		} else {
			//
			console.log('not logged in');
		}
	});

	// Handle user state changes
	const onAuthStateChangedHandler = (user) => {
		setUser(user);
		if (initializing) {
			setInitializing(false);
		}
	};

	useEffect(() => {
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
