import { StyleSheet } from 'react-native';

export const parshaStyles = StyleSheet.create({
  // Layout
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  // Text
  titleText: {
    writingDirection: 'rtl',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 16,
    color: '#222',
  },
  hebrewText: {
    writingDirection: 'rtl',
    textAlign: 'right',
    fontSize: 18,
    lineHeight: 28,
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },

  // Containers
  pasukContainer: { marginBottom: 12 },
});
