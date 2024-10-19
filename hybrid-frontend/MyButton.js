import styles from './styles'
import { Pressable, Text } from 'react-native';

const MyButton = ({ OnClick, variant, label }) => {
  switch (variant) {
    case 'contained':
      return (
        <Pressable
          style={({ pressed }) => [
            styles.containedButton,
            pressed && styles.buttonPressed
          ]}
          onPress={OnClick}
        >
          <Text style={styles.containedTextButton}>{label}</Text>
        </Pressable>
      );
      
    case 'outlined':
      return (
        <Pressable
          style={({ pressed }) => [
            styles.outlinedButton,
            pressed && styles.buttonPressed
          ]}
          onPress={OnClick}
        >
          <Text style={styles.outlinedTextButton}>{label}</Text>
        </Pressable>
      );
  }
}

export default MyButton;