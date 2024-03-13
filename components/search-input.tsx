import { useRef, useEffect } from 'react';
import { View, TextInput, StyleProp, ViewStyle } from 'react-native';
import Input from './input';
import { FontAwesome } from '@expo/vector-icons';

export type SearchInputProps = {
	onChangeText: (searchTerm: string) => void;
	value: string;
	onSubmitEditing?: () => void;
	focus: boolean;
	style?: StyleProp<ViewStyle>;
};

export default function SearchInput({
	onChangeText,
	value,
	focus,
	style,
	onSubmitEditing,
}: SearchInputProps) {
	const inputRef = useRef<TextInput>(null);
	useEffect(() => {
		if (!inputRef.current) {
			return;
		}
		if (focus) {
			inputRef.current.focus();
		}
	}, []);

	console.log('v', value);

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<TextInput
				ref={inputRef}
				value={value}
				autoCorrect={false}
				onSubmitEditing={onSubmitEditing}
				onChangeText={(newText) => onChangeText(newText)}
				style={{
					backgroundColor: 'white',
					borderWidth: 1,
					borderColor: '#d9d9d9',
					paddingVertical: 10,
					paddingHorizontal: 5,
					borderRadius: 5,
					width: '100%',
					height: 40,
					//@ts-ignore
					...style,
				}}
				placeholder={'Search...'}
			/>
			<FontAwesome
				style={{
					marginLeft: 'auto',
					right: 0,
					marginRight: 10,
				}}
				name='search'
				size={20}
				color='#999'
			/>
		</View>
	);
}
