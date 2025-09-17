import { useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ChapterPicker({ numPerakim }: { numPerakim: number }) {
  const [selectedPerek, setSelectedPerek] = useState(1);

  return (
    <View>
      <Picker
        selectedValue={selectedPerek}
        onValueChange={(itemValue) => setSelectedPerek(itemValue)}
      >
        {Array.from({ length: numPerakim }, (_, i) => (
          <Picker.Item key={i} label={(i + 1).toString()} value={i + 1} />
        ))}
      </Picker>
    </View>
  );
}
