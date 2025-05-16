import { StyleSheet } from 'react-native';
const { width } = require('react-native').Dimensions.get('window');
const CARD_SIZE = width / 3 - 20;
const ITEM_WIDTH = width * 0.4;

export default StyleSheet.create({
  containerCenter: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  welcomeBackground: {
    backgroundColor: '#11045a',   // purple background
  },
  statusBar: {
    width: '100%',
    height: 24,
    marginBottom: 20,
  },
  largeLogo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  welcomeTextGroup: {
    marginBottom: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 4,
  },
  primaryButton: {
    backgroundColor: '#0d6efd',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  formContainer: {
    width: '90%',
    alignItems: 'center',
  },
  mediumLogo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  inputBackground: {
    backgroundColor: '#e0e0e0',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    width: '100%',
    color: '#dc3545',
    marginBottom: 8,
  },
  linkText: {
    color: '#0d6efd',
    marginVertical: 8,
    fontSize: 16,
  },
  dividerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  smallIcon: {
    width: 32,
    height: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  successIcon: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  smallLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  screenContainer: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    width: 28,
    height: 28,
    marginLeft: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 140,
    backgroundColor: '#11045a',
    borderRadius: 6,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  grid: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: CARD_SIZE * 0.6,
    height: CARD_SIZE * 0.6,
  },
  backgroundPurple: {
    backgroundColor: '#11045a',
  },
  cardLabel: {
    marginTop: 8,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    width: '100%',
    paddingHorizontal: 20,
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginTop: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionSpacer: {
    flex: 1,
  },
  sectionContainer: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  gridItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  alignLeft: { alignSelf: 'flex-start' },
  alignRight: { alignSelf: 'flex-end' },
  imageOnly: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.6,
    borderRadius: 8,
  },
  imageLabel: {
    marginTop: 8,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  sectionRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  gridItemCenter: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
    containerSuc: {
    flex: 1,
    backgroundColor: '#11045a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTextSuc: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  bigCheckSuc: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  bottomTextSuc: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
});