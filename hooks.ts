import { Word } from './screens/WordsScreen';
import { parseFirebaseWords } from './utils';
import {
	ref,
	onValue,
	set,
	remove,
	push,
	type Database,
} from 'firebase/database';

// @Todo use generics to return dynamic type intead of Word[]
export const useFirebaseReadWords = async (
	db: Database
): Promise<Word[] | null> => {
	let result = null;
	try {
		const wordsRef = ref(db, 'words');
		onValue(wordsRef, (snapshot) => {
			const data = snapshot.val();
			console.log('d', data);
			result = parseFirebaseWords(data);
		});
	} catch (e) {
		console.log('Error: ', e);
	}
	return result;
};

export const useFirebaseSaveWord = (db: Database, word: Word): void => {
	try {
		const wordListRef = ref(db, 'words');
		const newWordRef = push(wordListRef);
		set(newWordRef, word);
	} catch (e) {
		console.log('Error: ', e);
	}
};

export const useFirebaseDeleteWord = (db: Database, id: string): void => {
	try {
		remove(ref(db, `words/${id}`));
	} catch (e) {
		console.log('Error: ', e);
	}
};
