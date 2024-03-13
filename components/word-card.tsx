import { TouchableOpacity, View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type WordCardProps = {
	word: WordItem;
	onDelete: (word: WordItem) => void;
	onEdit: (word: WordItem) => void;
};

export const WordCard = ({ word, onDelete, onEdit }: WordCardProps) => {
	return (
		<View
			key={word.id}
			style={{
				flex: 1,
				flexGrow: 1,
				flexDirection: 'row',
				borderBottomWidth: 1,
				paddingTop: 10,
				paddingBottom: 8,
				borderColor: '#d9d9d9',
			}}
		>
			<TouchableOpacity onPress={() => onEdit(word)}>
				<Text style={{ fontSize: 16 }}>
					{word.title.charAt(0).toUpperCase() + word.title.slice(1)}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{ marginLeft: 'auto' }}
				onPress={() => {
					onDelete(word);
				}}
			>
				<FontAwesome name='trash-o' size={24} color='red' />
			</TouchableOpacity>
		</View>
	);
};
