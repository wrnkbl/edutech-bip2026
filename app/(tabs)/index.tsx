import PointsIcon from '@/app/components/Icons/PointsIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../_shared/appstate';
import Header from '../components/Header';

export default function HomeScreen() {
  const state = useAppState()
  const isReady = !state.isLoading && state.isInitialized

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My courses"
        searchPlaceholder="courses..."
      />

      <LinearGradient
        colors={['#93B5C6', '#F2E6B6']}
        style={styles.content}
      >
        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.mainWrapper}>
            {isReady ? (
              state.courses.map((course: any) => {
                const tasks = course.assignments.length;
                const completedTasks = course.assignments.filter((a: { submissionDate: any; }) => a.submissionDate).length;

                const progress = course.pointsMax && course.pointsMax > 0
                  ? (course.pointsGained / course.pointsMax) * 100
                  : 0;

                return (
                  <Link key={course.uuid} href={`../${course.uuid}`} style={styles.link}>
                    <View style={styles.card}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.courseName}>{course.name}</Text>
                        <Text style={styles.courseMeta}>
                          {completedTasks}/{tasks} tasks completed
                        </Text>
                      </View>

                      <View style={styles.cardBody}>
                        <View style={styles.pointsRow}>
                          <View style={styles.pointsLabelRow}>
                            <PointsIcon color={'#4a2e22'} size={16} />
                            <Text style={styles.pointsLabel}>Points</Text>
                          </View>
                          <Text style={styles.pointsValue}>
                            {course.pointsGained} / {course.pointsMax}
                          </Text>
                        </View>

                        <View style={styles.progressTrack}>
                          <View style={[
                            styles.progressFill,
                            { width: `${Math.min(Math.max(Math.round(progress), 0), 100)}%` },
                          ]}
                          />
                        </View>
                      </View>
                    </View>
                  </Link>
                )
              })) :
              (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4E342E" />
                </View>
              )
            }
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E342E',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#4E342E',
    fontFamily: 'Capriola',
    fontSize: 14,
    opacity: 0.7,
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  listContainer: {
    paddingBottom: 24,
    alignItems: 'stretch',
  },
  link: {
    marginBottom: 16,
    width: '100%',
  },
  card: {
    backgroundColor: '#f2e6b6',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    width: '100%',
  },
  cardHeader: {
    marginBottom: 12,
  },
  courseName: {
    color: '#4a2e22',
    fontFamily: 'TitanOne',
    fontSize: 18,
    marginBottom: 4,
  },
  courseMeta: {
    color: '#4A2E22',
    fontSize: 14,
    fontFamily: 'Capriola',
  },
  cardBody: {
    gap: 8,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsLabel: {
    color: '#4A2E22',
    fontFamily: 'Capriola',
    fontSize: 14,
    marginLeft: 6,
  },
  pointsValue: {
    color: '#4A2E22',
    fontSize: 14,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#4a2e226c',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#93b5c6',
    borderRadius: 999,
  },
});