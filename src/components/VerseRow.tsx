import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import RenderHTMLBase from 'react-native-render-html';
import type { BookName, ShnayimMikrahVerse } from '../parsha/types.ts';
import { parshaStyles } from '../styles/parshaStyles.ts';
import { toHebrewNumeral } from '../utils/toHebrewNumeral.ts';
const RenderHTML = RenderHTMLBase as any;

const verseId = (verse: ShnayimMikrahVerse, book: BookName) =>
  `${book}:${verse.chapter}:${verse.verse}`;

type Props = {
  verse: ShnayimMikrahVerse;
  book: BookName;
};

export const VerseRow = React.memo(
  ({ verse, book }: Props) => {
    const { width } = useWindowDimensions();

    return (
      <View style={parshaStyles.pasukContainer}>
        <Text style={parshaStyles.pasukNumber}>
          {toHebrewNumeral(verse.chapter)}:{toHebrewNumeral(verse.verse)}
        </Text>

        <RenderHTML
          contentWidth={width}
          source={{ html: verse.hebrew }}
          baseStyle={parshaStyles.hebrewText}
        />

        {verse.english && (
          <RenderHTML
            contentWidth={width}
            source={{ html: verse.english }}
            baseStyle={parshaStyles.englishText}
          />
        )}
      </View>
    );
  },
  (prev, next) =>
    verseId(prev.verse, prev.book) === verseId(next.verse, next.book),
);
