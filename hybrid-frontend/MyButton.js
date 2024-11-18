import styles from './styles'
import { Text, TouchableOpacity } from 'react-native';

const MyButton = ({ OnClick, variant, label, disabled }) => (
  <TouchableOpacity
    style={[
      variant==='contained' ? styles.containedButton : styles.outlinedButton,
      { opacity: disabled ? 0.4 : 1 }
    ]}
    activeOpacity={0.6}
    onPress={OnClick}
    disabled={disabled}
  >
    <Text style={variant==='contained' ? styles.containedTextButton : styles.outlinedTextButton}>{label}</Text>
  </TouchableOpacity>
);


export default MyButton;