// app/common/components/InputRow.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function InputRow({
  label,
  value,
  onChange,
  secure,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  secure?: boolean;
  keyboardType?: any;
}) {
  return (
    <View style={styles.row}>
      <TextInput
        style={{ flex: 1 }}
        label={label}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 10 },
});
