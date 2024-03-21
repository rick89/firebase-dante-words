import { useEffect, useRef } from 'react';
import {
	NativeSyntheticEvent,
	StyleProp,
	TextInput,
	TextInputKeyPressEventData,
	ViewStyle,
} from 'react-native';

export type TextInputProps = {
	placeholder?: string;
	onChangeText: (newText: string) => void;
	onSubmitEditing?: () => void;
	value: string;
	style?: StyleProp<ViewStyle>;
	focus?: boolean;
};

export default function CustomInput({
	placeholder,
	value,
	onChangeText,
	onSubmitEditing,
	style,
	focus,
}: TextInputProps) {
	const inputRef = useRef<TextInput>(null);

	useEffect(() => {
		if (!inputRef.current) {
			return;
		}
		if (focus) {
			inputRef.current.focus();
		}
	}, []);

	return (
		<TextInput
			autoComplete='off'
			autoCapitalize='none'
			ref={inputRef}
			value={value}
			autoCorrect={false}
			onChangeText={(newText) => onChangeText(newText)}
			style={{
				backgroundColor: 'white',
				borderWidth: 1,
				borderColor: '#d9d9d9',
				width: 300,
				paddingVertical: 10,
				paddingHorizontal: 5,
				borderRadius: 5,
				//@ts-ignore
				...style,
			}}
			placeholder={placeholder}
			onSubmitEditing={onSubmitEditing}
		/>
	);
}
