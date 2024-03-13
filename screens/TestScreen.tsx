import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function TestScreen() {
	const db = getDatabase();

	useEffect(() => {
		try {
			const wordsRef = ref(db, 'test');
			onValue(wordsRef, (snapshot) => {
				const data = snapshot.val();
				console.log('d', data);
				if (!data) {
					return;
				}
				// setWords(parseFirebaseWords(data));
			});
		} catch (e) {
			console.log('Error: ', e);
		}
	}, []);

	return <View></View>;
}
