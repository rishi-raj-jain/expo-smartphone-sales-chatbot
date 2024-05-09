import React from "react";
import { useChat } from "react-native-vercel-ai";
import Markdown from "react-native-markdown-display";
import { Pressable, Text, ScrollView, TextInput, View } from "react-native";

export default function App() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "http://localhost:8081/api/chat",
  });
  return (
    <ScrollView className="flex flex-1">
      <View className="flex flex-col px-8 py-12">
        {messages.map((m) => (
          <View
            key={m.id}
            className="flex flex-col gap-y-1 border-b border-gray-100 py-3"
          >
            <Text className="text-gray-600 capitalize">{m.role}</Text>
            <Markdown>{m.content}</Markdown>
          </View>
        ))}
        <TextInput
          value={input}
          placeholder="Say something..."
          // @ts-ignore
          onChangeText={(e) => handleInputChange(e)}
          className="mt-3 w-full p-2 border border-gray-300 rounded"
        />
        <Pressable className="mt-3" onPress={handleSubmit}>
          <Text className="w-[80px] border rounded px-3 py-1 bg-black text-white">
            Chat &rarr;
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
