import { StyleSheet } from 'react-native';

export const parshaStyles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pasukContainer: { marginBottom: 12 },
  hebrewText: {
    writingDirection: 'rtl',
    textAlign: 'right',
    fontSize: 18,
    lineHeight: 28,
  },
  titleText: {
    writingDirection: 'rtl',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 16,
    color: '#222',
  },
});
