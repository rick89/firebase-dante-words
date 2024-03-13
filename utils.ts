import { Word } from './screens/WordsScreen';

export const uniqueId = () => {
	const dateString = Date.now().toString(36);
	const randomness = Math.random().toString(36).substr(2);
	return dateString + randomness;
};

export function parseFirebaseWords(data: string): Word[] {
	let array: Word[] = [];
	// const parsedData: [] = JSON.parse(data);

	Object.keys(data).forEach((id) => {
		array.push({
			id,
			//@ts-ignore
			title: data[id].title,
			//@ts-ignore
			created: data[id].created,
		});
	});

	return array;
}
