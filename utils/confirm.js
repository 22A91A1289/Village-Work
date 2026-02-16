import { Alert, Platform } from 'react-native';

/**
 * Cross-platform confirm dialog.
 * Alert.alert() onPress callbacks don't fire on web, so we use window.confirm for web.
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {function} onConfirm - Called when user confirms
 * @param {function} onCancel - Called when user cancels
 * @param {object} options - { confirmText: 'Sign Out', cancelText: 'Cancel' }
 */
export function confirm(title, message, onConfirm, onCancel, options = {}) {
  const { confirmText = 'OK', cancelText = 'Cancel' } = options;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) {
      onConfirm?.();
    } else {
      onCancel?.();
    }
  } else {
    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel', onPress: onCancel },
      { text: confirmText, style: 'destructive', onPress: onConfirm },
    ]);
  }
}
