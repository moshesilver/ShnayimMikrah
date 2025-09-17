import { useState, useEffect } from 'react';
import { Text, View, ScrollView, useWindowDimensions } from 'react-native';
import RenderHTMLBase from 'react-native-render-html';
// double-cast via unknown to silence the strict structural check
const RenderHTML = RenderHTMLBase as unknown as React.ComponentType<any>;
// import PerekPicker from '../components/PerekPicker.tsx';

export default function Parsha() {
  const [text, setText] = useState<string>('Loading...');
  // const [numPerakim, setNumPerakim] = useState<number>(0);

  const { width } = useWindowDimensions();

  useEffect(() => {
    async function loadText() {
      try {
        const vhe = encodeURIComponent("Tanach with Ta'amei Hamikra");

        const response = await fetch(
          /*  "https://raw.githubusercontent.com/Sefaria/Sefaria-Export/master/json/Tanakh/Torah/Genesis/Hebrew/Tanach%20with%20Ta'amei%20Hamikra.json", */ 'https://www.sefaria.org/api/v3/texts/Genesis%201:1-6:8?lang=he&vhe=${vhe}',
        );
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        const verses = data.versions[0].text.flat().join(' ');

        setText(`<div dir="rtl">${verses}</div>`);
      } catch (err) {
        console.error(err);
        setText('Error loading text');
      }
    }

    loadText();
  }, []);
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
      contentContainerStyle={{
        padding: 16,
      }}
    >
      {/* <PerekPicker numPerakim={numPerakim} /> */}
      {/* <Text style={{ writingDirection: 'rtl', textAlign: 'right' }}>
        {text}
      </Text> */}
      <RenderHTML
        contentWidth={width}
        source={{ html: text }}
        tagsStyles={{
          body: { writingDirection: 'rtl', textAlign: 'right', fontSize: 20 },
          div: { writingDirection: 'rtl', textAlign: 'right' },
        }}
      />
    </ScrollView>
  );
}
