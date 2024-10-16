// movie-app/utils/errorHandler.ts

import { Alert } from 'react-native';

export const handleServiceError = (action: string, error: unknown) => {
  if (error instanceof Error) {
    console.error(`Error ${action}:`, error.message);
    Alert.alert('오류', `${action} 중 오류가 발생했습니다: ${error.message}`);
  } else {
    console.error(`Error ${action}:`, error);
    Alert.alert('오류', `${action} 중 예상치 못한 오류가 발생했습니다.`);
  }
};

export const handleError = (error: unknown, defaultMessage: string) => {
  if (error instanceof Error) {
    console.error(defaultMessage, error.message);
    Alert.alert('오류', defaultMessage);
  } else {
    console.error('Unexpected error', error);
    Alert.alert('오류', '예기치 못한 오류가 발생했습니다.');
  }
};