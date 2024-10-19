import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E0808',
    alignItems: 'center',
    gap: 25,
    padding: 20,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  containedButton: {
    backgroundColor: '#D97A40',
    borderRadius: 4,
    padding: 10,
    width: '100%',
  },
  containedTextButton: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: '#D97A40',
    borderRadius: 4,
    padding: 10,
    width: '100%',
  },
  outlinedTextButton: {
    color: '#D97A40',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  defaultText: {
    color: '#d9d9d9',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  input: {
    height: 40,
    backgroundColor: '#350606',
    color: '#D97A40',
    fontSize: 16,
    fontFamily: 'Roboto',
    borderBottomColor: '#200101',
    borderBottomWidth: 1,
    borderRadius: 3,
    width: '100%',
    padding: 20,
  },
  error: {
    color: '#ff1744',
    textAlign: 'left',
    fontSize: 12
  }
});

export default styles;