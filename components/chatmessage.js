import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatMessage = ({ message }) => {
  const isMe = message.sender === 'me';

  return (
    <View
      style={[
        styles.messageBubble,
        isMe ? styles.sent : styles.received
      ]}
    >
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    maxWidth: '75%',
  },
  sent: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
});
