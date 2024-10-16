// movie-app/components/TrailerPlayer.tsx

import React, { useCallback, useRef } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Video as VideoType } from '../../types/movie';
import { XMarkIcon } from 'react-native-heroicons/solid';

interface TrailerPlayerProps {
  visible: boolean;
  video: VideoType | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16; // 16:9 비율

const TrailerPlayer: React.FC<TrailerPlayerProps> = ({ visible, video, onClose }) => {
  const playerRef = useRef<any>(null);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      onClose();
    }
  }, [onClose]);

  if (!video) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          accessibilityLabel="트레일러 닫기 버튼"
          accessibilityRole="button"
        >
          <XMarkIcon size={30} color="white" />
        </TouchableOpacity>
        <YoutubePlayer
          ref={playerRef}
          height={VIDEO_HEIGHT}
          width={width}
          play={visible}
          videoId={video.key}
          onChangeState={onStateChange}
          webViewStyle={{ backgroundColor: 'black' }}
          forceAndroidAutoplay={false}
        />
      </View>
    </Modal>
  );
};

export default TrailerPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
});
