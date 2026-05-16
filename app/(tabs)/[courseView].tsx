/**
    user: state.user,
    userPoints: state.userPoints,
    store: state.store,
    courses: state.courses,
    allAssignments: state.allAssignments,
    courseUsers: state.courseUsers,
    hasDb: !!state.db,
    isInitialized: state.isInitialized,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
*/

import { useAppState } from '@/app/_shared/appstate';
import Header from '@/app/components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function CourseDetailScreen() {
  const state = useAppState.getState();
  const { courseView } = useLocalSearchParams<{ courseView: string }>();
  console.log('courseView', courseView)
  // courseView == course.uuid

  const course = state.courses.find((course: any) => course.uuid === courseView)
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {course ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Course found</Text>
                <Text style={styles.emptyText}>Decided against making this page until the Figma page for this has been created or decision on some more detailed design has been made</Text>
              </View>
            )
              : (
                <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Course not found</Text>
              </View>
              )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView >
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

  /* Course details */
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7CCC8',
    padding: 18,
    marginBottom: 18,
  },

  /* Course not found */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
});