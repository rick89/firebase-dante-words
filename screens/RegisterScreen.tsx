import { useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../components/input';
import CustomButton from '../components/custom-button';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const auth = getAuth();
	const navigation = useNavigation();

	const handleRegister = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed up
				const user = userCredential.user;
				console.log('user', user);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log('error code: ', errorCode);
				console.log('error message', errorMessage);
			});
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					paddingHorizontal: 14,
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Text
					style={{
						fontSize: 20,
						marginBottom: 20,
						textAlign: 'center',
					}}
				>
					Register
				</Text>
				<CustomInput
					style={{ marginBottom: 20 }}
					onChangeText={(value) => setEmail(value)}
					placeholder='Email'
					value={email}
				/>
				<CustomInput
					style={{ marginBottom: 20 }}
					onChangeText={(value) => setPassword(value)}
					placeholder='Password'
					value={password}
				/>
				<CustomButton
					onPress={() => handleRegister()}
					title='Register'
				/>
			</View>
		</SafeAreaView>
	);
}
