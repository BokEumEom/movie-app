// components/MovieRating.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface MovieRatingProps {
  initialRating: number | null; // 초기 평점 값
  onRatingChange: (value: number) => void;
  onSubmit: (value: number) => void;
  onDelete: () => void;
}

const MovieRating: React.FC<MovieRatingProps> = ({
  initialRating,
  onRatingChange,
  onSubmit,
  onDelete,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(initialRating ?? 0);

  useEffect(() => {
    setSelectedRating(initialRating ?? 0);
  }, [initialRating]);

  const handleSliderChange = (value: number) => {
    setSelectedRating(value);
    onRatingChange(value);
  };

  const handleButtonPress = () => {
    if (initialRating !== null) {
      onDelete();
    } else {
      onSubmit(selectedRating);
    }
  };

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingTitle}>이 영화 평가하기:</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={{ width: width * 0.9, height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={10}
          value={selectedRating}
          minimumTrackTintColor="#EAB308"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor={initialRating !== null ? "#E11D48" : "#EAB308"}
          onValueChange={handleSliderChange}
          accessibilityLabel="영화 평점 슬라이더"
          accessibilityHint="0부터 100까지 10 단위로 영화 평점을 선택하세요"
        />
      </View>
      {renderSliderLabels()}
      <TouchableOpacity
        onPress={handleButtonPress}
        style={initialRating !== null ? styles.deleteRatingButton : styles.submitRatingButton}
        accessibilityLabel={initialRating !== null ? '평가 삭제 버튼' : '평가 하기 버튼'}
      >
        <Text style={initialRating !== null ? styles.deleteRatingButtonText : styles.submitRatingButtonText}>
          {initialRating !== null ? '평가 삭제' : '평가 하기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const renderSliderLabels = () => {
  return (
    <View style={[styles.sliderLabelContainer, { width: width * 0.9 }]}>
      {Array.from({ length: 11 }, (_, i) => (
        <View key={i} style={styles.sliderLabelWrapper}>
          <View style={styles.sliderTick} />
          <Text style={styles.sliderLabel}>{i * 10}</Text>
        </View>
      ))}
    </View>
  );
};

export default MovieRating;

const styles = StyleSheet.create({
  ratingContainer: {
    alignItems: 'center',
    marginVertical: 10,
    width: '90%',
  },
  ratingTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  sliderContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -10,
  },
  sliderLabelWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  sliderTick: {
    width: 2,
    height: 4,
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },
  sliderLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  submitRatingButton: {
    marginTop: 20,
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
  },
  submitRatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteRatingButton: {
    marginTop: 10,
    backgroundColor: '#E11D48',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
  },
  deleteRatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
