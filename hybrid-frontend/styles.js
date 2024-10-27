import { StyleSheet, StatusBar } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E0808',
    alignItems: 'center',
    gap: 25,
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#3E0808',
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
  },
  appBar: {
    marginTop: StatusBar.currentHeight + 3,
    backgroundColor: '#462005',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.5)',
    shadowColor: "black",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 16, // Android
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 10,
  },
  formContainer: {
    marginVertical: 20,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  errorText: {
    color: 'red',
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#D97A40'
  },
  sliderThumb: {
    height: 20,
    width: 20,
    backgroundColor: '#000',
  },
  sliderTrack: {
    height: 10,
  },
});

export default styles;