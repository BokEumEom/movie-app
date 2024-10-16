// movie-app/app/(tabs)/index.jsx

import { View, Text, ScrollView, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import TrendingMovies from '../../components/movies/TrendingMovies'
import MovieList from '../../components/movies/MovieList'
import { theme } from '@/constants/theme'
import { useRouter } from 'expo-router';
import Loading from '../../components/common/Loading'
import { fetchTrendingMovies, fetchUpcomingMovies, fetchTopRatedMovies, fetchNowPlayingMovies, fetchPopularMovies } from '../../services/moviedb'

const ios = Platform.OS === 'ios';

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(()=>{
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
    getNowPlayingMovies();
    getPopularMovies();
  },[])

  const getTrendingMovies = async ()=>{
    const data = await fetchTrendingMovies();
    if(data && data.results) setTrending(data.results);
    setLoading(false);
  }

  const getUpcomingMovies = async ()=>{
    const data = await fetchUpcomingMovies();
    if(data && data.results) setUpcoming(data.results);
  }

  const getTopRatedMovies = async ()=>{
    const data = await fetchTopRatedMovies();
    if(data && data.results) setTopRated(data.results);
  }

  const getNowPlayingMovies = async ()=>{
    const data = await fetchNowPlayingMovies();
    if(data && data.results) setNowPlaying(data.results);
  }

  const getPopularMovies = async ()=>{
    const data = await fetchPopularMovies();
    if(data && data.results) setPopular(data.results);
  }

  return (
    <View style={styles.container}>
      {/* 검색 바 및 로고 */}
      <SafeAreaView style={ios ? styles.iosSafeArea : styles.androidSafeArea}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white" />
          <Text style={styles.title}>
            <Text style={theme.colors.text}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/search'})}>
            <MagnifyingGlassIcon size={30} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {
        loading ? (
          <Loading />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}      
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {/* Trending movies carousel */}
            { trending.length > 0 && <TrendingMovies data={trending} /> }

            {/* Now Playing movies row */}
            { nowPlaying.length > 0 && <MovieList title="Now Playing" data={nowPlaying} /> }

            {/* Popular movies row */}
            { popular.length > 0 && <MovieList title="Popular" data={popular} /> }

            {/* Upcoming movies row */}
            { upcoming.length > 0 && <MovieList title="Upcoming" data={upcoming} /> }

            {/* Top Rated movies row */}
            { topRated.length > 0 && <MovieList title="Top Rated" data={topRated} /> }

          </ScrollView>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // bg-neutral-800
  },
  iosSafeArea: {
    marginBottom: -8, // -mb-2
  },
  androidSafeArea: {
    marginBottom: 12, // mb-3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16, // mx-4
  },
  title: {
    color: 'white', // text-white
    fontSize: 24, // text-3xl (roughly 24px in native)
    fontWeight: 'bold', // font-bold
  },
});
