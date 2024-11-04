import styles from './styles'
import { Pressable, Text } from 'react-native';

const MyButton = ({ OnClick, variant, label, disabled }) => {
  switch (variant) {
    case 'contained':
      return (
        <Pressable
          style={({ pressed }) => [
            styles.containedButton,
            pressed && styles.buttonPressed,
            { opacity: disabled ? 0.4 : 1 }
          ]}
          onPress={OnClick}
          disabled={disabled}
        >
          <Text style={styles.containedTextButton}>{label}</Text>
        </Pressable>
      );
      
    case 'outlined':
      return (
        <Pressable
          style={({ pressed }) => [
            styles.outlinedButton,
            pressed && styles.buttonPressed,
            { opacity: disabled ? 0.4 : 1 }
          ]}
          onPress={OnClick}
          disabled={disabled}
        >
          <Text style={styles.outlinedTextButton}>{label}</Text>
        </Pressable>
      );
  }
}

export default MyButton;