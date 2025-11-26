// app/common/components/AppHeader.tsx
import React from 'react';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function AppHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <Appbar.Header style={{backgroundColor:"#fd1212ea"}}>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
