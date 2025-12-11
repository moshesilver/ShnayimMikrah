import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Index() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [items, setItems] = useState([
    { label: 'Whole Parsha', value: 0 },
    { label: 'ראשון', value: 1 },
    { label: 'שני', value: 2 },
    { label: 'שלישי', value: 3 },
    { label: 'רביעי', value: 4 },
    { label: 'חמישי', value: 5 },
    { label: 'ששי', value: 6 },
    { label: 'שביעי', value: 7 },
  ]);

  const handleSelect = (val: number) => {
    const isFull = val === 0;

    router.push({
      pathname: '/parsha',
      params: {
        mode: isFull ? 'full' : 'aliyah',
        aliyah: isFull ? null : val,
      },
    });
  };

  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select an option"
        style={{
          borderColor: '#ccc',
          height: 50,
        }}
        dropDownContainerStyle={{
          borderColor: '#ccc',
          maxHeight: 350,
        }}
        onSelectItem={(item) => handleSelect(item.value!)}
      />
    </View>
  );
}
