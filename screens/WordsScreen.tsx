import React, { useState, type ReactNode, useRef, useEffect } from 'react';
import {
	Text,
	SafeAreaView,
	View,
	TouchableOpacity,
	Alert,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
	ListRenderItem,
	FlatList,
	StyleSheet,
} from 'react-native';
import SearchInput from '../components/search-input.tsx';
import { DateTime } from 'luxon';
import { parseFirebaseWords, uniqueId } from '../utils.ts';
import CustomButton from '../components/custom-button.tsx';
import Input from '../components/input.tsx';
import {
	getDatabase,
	ref,
	push,
	set,
	onValue,
	remove,
} from 'firebase/database';
import { FontAwesome } from '@expo/vector-icons';
import {
	useFirebaseDeleteWord,
	useFirebaseReadWords,
	useFirebaseSaveWord,
} from '../hooks.ts';
import { WordCard } from '../components/word-card.tsx';

export interface Word {
	id: string;
	title: string;
	created: string;
}

export default function WordsScreen() {
	const [screenKey, setScreenKey] = useState(0);
	const [isLoadingWords, setIsLoadingWords] = useState(true);
	const [words, setWords] = useState<Word[]>([]);
	const db = getDatabase();
	const [searchTerm, setSearchTerm] = useState('');
	const filteredWords = words
		.filter((word) => word.title.includes(searchTerm.toLowerCase()))
		.reverse();
	const [endReached, setEndReached] = useState(false);
	const [inEditMode, setInEditMode] = useState(false);
	const wordTouchableOpacityRef = useRef<
		React.MutableRefObject<TouchableOpacity>[]
	>(new Array());
	const wordInputRef = useRef(new Array());
	const wordExistsInState = () => {
		return !!words.find((word) => word.title === searchTerm);
	};

	useEffect(() => {
		setIsLoadingWords(true);
		// const fetchWords = async () => {
		// 	return await useFirebaseReadWords(db);
		// };
		// fetchWords().then((words) => setWords(words ? words : []));
		try {
			const wordsRef = ref(db, 'words');
			onValue(wordsRef, (snapshot) => {
				const data = snapshot.val();
				console.log('d', data);
				if (!data) {
					setWords([]);
					return;
				}
				setWords(parseFirebaseWords(data));
			});
		} catch (e) {
			console.log('Error: ', e);
		}
		setTimeout(() => {
			setIsLoadingWords(false);
		}, 1000);
	}, [screenKey]);

	console.log('words', words);

	const handleSaveWord = () => {
		if (searchTerm !== '' && !wordExistsInState()) {
			const wordForPush: Word = {
				id: uniqueId(),
				title: searchTerm,
				created: DateTime.now().toISO(),
			};
			// useFirebaseSaveWord(db, wordForPush);
			try {
				const wordListRef = ref(db, 'words');
				const newWordRef = push(wordListRef);
				set(newWordRef, wordForPush);
			} catch (e) {
				console.log('Error: ', e);
			}
		}
		setSearchTerm('');
	};

	const handleConfirmDeleteWord = (word: Word) => {
		Alert.alert('Delete', `Are you sure you want to delete ${word.title}`, [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					handleDeleteWord(word.id);
				},
			},
		]);
	};

	const handleDeleteWord = (id: string) => {
		// useFirebaseDeleteWord(db, id);
		try {
			remove(ref(db, `words/${id}`));
			forceReRender();
		} catch (e) {
			console.log('Error: ', e);
		}
	};

	function forceReRender() {
		setScreenKey((prev) => prev + 1);
	}

	const Item = ({ item }: { item: WordItem }) => (
		<WordCard
			onEdit={() => {}}
			word={item}
			onDelete={(item) => {
				handleConfirmDeleteWord(item);
			}}
			key={item.id}
		/>
	);

	const renderItem: ListRenderItem<WordItem> = ({ item }) => (
		<Item item={item} />
	);

	let viewNode: ReactNode;

	if (filteredWords.length === 0 && !isLoadingWords && searchTerm !== '') {
		viewNode = (
			<Text>Word not found, press save to add the word to the list.</Text>
		);
	} else if (filteredWords.length === 0 && !isLoadingWords) {
		viewNode = <Text>No words to display.</Text>;
	}

	if (isLoadingWords) {
		viewNode = <ActivityIndicator />;
	}

	if (filteredWords.length > 0 && !isLoadingWords) {
		viewNode = (
			<FlatList
				data={filteredWords}
				renderItem={renderItem}
				keyExtractor={(item: WordItem) => item.id}
				onEndReached={() => setEndReached(true)}
			/>
		);
	}

	return (
		// <KeyboardAvoidingView
		// 	style={{
		// 		flex: 1,
		// 	}}
		// 	behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		// >
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					paddingHorizontal: 14,
					marginBottom: 20,
					flex: 1,
				}}
			>
				<View
					style={{
						flexDirection: 'column',
						marginBottom: 20,
						flexGrow: 1,
						flex: 1,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							paddingVertical: 10,
						}}
					>
						<View
							style={{
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Text style={{ fontSize: 22 }}>Dante words</Text>
						</View>
						<View
							style={{
								marginLeft: 'auto',
								borderRadius: 200,
								width: 50,
								height: 50,
								backgroundColor: 'green',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Text style={{ fontSize: 22, color: 'white' }}>
								{words.length}
							</Text>
						</View>
					</View>
					<View
						style={{
							marginTop: 20,
						}}
					>
						<SearchInput
							focus={true}
							value={searchTerm}
							onChangeText={(searchTerm) => {
								setSearchTerm(searchTerm.toLowerCase());
							}}
							onSubmitEditing={() => {
								handleSaveWord();
							}}
						/>
					</View>
					<View
						style={{
							flex: 1,
						}}
					>
						<View style={{ flexGrow: 1, marginVertical: 16 }}>
							{viewNode}
							{!endReached && !isLoadingWords && (
								// <View
								// 	style={{
								// 		flex: 1,
								// 		flexGrow: 1,
								// 		height: 30,
								// 		backgroundColor: 'red',
								// 	}}
								// >
								<FontAwesome
									style={{
										alignSelf: 'center',
										marginTop: 10,
									}}
									name='angle-down'
									size={24}
									color='black'
								/>
								// </View>
							)}
						</View>
						{searchTerm !== '' && !wordExistsInState() && (
							<CustomButton
								title='Save'
								onPress={() => handleSaveWord()}
							/>
						)}
					</View>
				</View>
			</View>
		</SafeAreaView>
		// </KeyboardAvoidingView>
	);
}
