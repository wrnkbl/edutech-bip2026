import { useAppState } from '@/app/_shared/appstate';
import Header from '@/app/components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PointsIcon from '@/app/components/Icons/PointsIcon';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Assignment = {
  uuid: string;
  name: string;
  description: string;
  dueDate: string;
  submissionDate: string | null;
  pointsGained: number | null;
  pointsMax: number;
};

type CourseUser = {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function CourseDetailScreen() {
  const state = useAppState.getState();
  const { courseView, tab } = useLocalSearchParams<{ courseView?: string; tab?: string }>();
  // courseView == course.uuid
  const [activeTab, setActiveTab] = useState<'tasks' | 'leaderboard'>(tab === 'leaderboard' ? 'leaderboard' : 'tasks');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setActiveTab(tab === 'leaderboard' ? 'leaderboard' : 'tasks');
    setSearchQuery('');
  }, [tab]);

  const course = state.courses.find((course: any) => course.uuid === courseView);
  const users = state.courseUsers?.[courseView ?? '']
  const assignments: Assignment[] = state.allAssignments?.[courseView ?? ''];

  const leaderboard = users
    .map((u: CourseUser) => {
      const points = assignments.reduce((s: number, a: Assignment) => s + (a.pointsGained ?? 0), 0);
      return { uuid: u.uuid, name: `${u.firstName} ${u.lastName}`, points };
    })
    .sort((a: any, b: any) => b.points - a.points)
    .map((u: any, idx: any) => ({
      rank: idx + 1,
      name: u.name,
      points: u.points,
      avatar: '👤',
      isCurrentUser: u.uuid === state.user.uuid,
    }));

  const tasks = course.assignments.length;
  const completedTasks = course.assignments.filter((a: { submissionDate: any; }) => a.submissionDate).length;

  const progress = course.pointsMax && course.pointsMax > 0
    ? (course.pointsGained / course.pointsMax) * 100
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={'Course'}
        searchPlaceholder={`${activeTab}...`}
        onSearchChange={(text) => setSearchQuery(text)}
      />

      <LinearGradient
        colors={['#93B5C6', '#F2E6B6']}
        style={styles.content}
      >
        {course ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Tabs */}
            <View style={styles.tabBar}>
              <Link
                href={{
                  pathname: '/[courseView]',
                  params: { courseView: courseView ?? '', tab: 'tasks' },
                }}
                style={[styles.tabButton, activeTab === 'tasks' && styles.activeTabButton]}
              >
                <Text style={[styles.tabButtonText, activeTab === 'tasks' && styles.activeTabButtonText]}>
                  Tasks
                </Text>
              </Link>

              <Link
                href={{
                  pathname: '/[courseView]',
                  params: { courseView: courseView ?? '', tab: 'leaderboard' },
                }}
                style={[styles.tabButton, activeTab === 'leaderboard' && styles.activeTabButton]}
              >
                <Text style={[styles.tabButtonText, activeTab === 'leaderboard' && styles.activeTabButtonText]}>
                  Leaderboard
                </Text>
              </Link>
            </View>

            {/* Course header */}
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
                    <PointsIcon color={'#f2e6b6'} size={16} />
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

            {/* Tasks */}
            {activeTab === 'tasks' && (
              <View style={{ paddingTop: 12 }}>
                {assignments
                  .filter((task: any) => {
                    const q = searchQuery.toLowerCase();
                    return (
                      task.name.toLowerCase().includes(q) ||
                      task.description.toLowerCase().includes(q)
                    );
                  })
                  .map((task: any) => {
                    const progress = task.pointsMax > 0 ? ((task.pointsGained ?? 0) / task.pointsMax) * 100 : 0;
                    const isCompleted = task.submissionDate !== null; // <-- Checks if the task has been submitted
                    const due = new Date(task.dueDate);
                    let daysLeft = 0;

                    if (!isCompleted) {
                      const now = new Date();
                      const msLeft = due.getTime() - now.getTime();
                      daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
                    }

                    const isPastDue = new Date(task.dueDate).getTime() < Date.now() && !isCompleted;

                    return (
                      <View
                        key={task.uuid}
                        style={[
                          styles.taskCard,
                          isCompleted && styles.cardCompleted,
                          isPastDue && styles.cardLate,
                        ]}
                      >
                        <View style={styles.taskHeader}>
                          <View style={{ flex: 1 }}>
                            <View style={styles.taskTitleRow}>
                              <Text style={styles.taskTitle}>{task.name}</Text>
                            </View>
                            <Text style={styles.taskDescription}>{task.description}</Text>
                            <View style={styles.taskMetaRow}>
                              <View style={styles.metaItem}>
                                <MaterialCommunityIcons name="calendar-month" size={14} color="#4a2e22" />
                                <Text style={styles.metaText}>{due.toLocaleDateString()}</Text>
                              </View>

                              <View style={styles.metaItem}>
                                <MaterialCommunityIcons name="clock-outline" size={14} color="#4a2e22" />
                                <Text style={styles.metaText}>
                                  {isCompleted
                                    ? 'Completed'
                                    : isPastDue
                                      ? `${Math.abs(daysLeft)} days late`
                                      : `${daysLeft} days left`}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        {isCompleted &&
                          <View style={styles.pointsValueRow}>
                            <Text style={styles.taskPointsValue}>
                              {task.pointsGained ?? 0}/{task.pointsMax}
                            </Text>

                            <PointsIcon color={'#4a2e22'} size={16} />
                          </View>}

                        <View style={styles.progressBackground}>
                          <View style={[styles.progressFillTask, { width: `${progress}%` }]} />
                        </View>
                      </View>
                    );
                  })}
              </View>
            )}

            {/* Leaderboard */}
            {activeTab === 'leaderboard' && (
              <View style={{ paddingTop: 12 }}>
                {leaderboard
                  .filter((student: any) => {
                    const q = searchQuery.toLowerCase();
                    return student.name.toLowerCase().includes(q);
                  })
                  .map((student: any) => {

                    const isTopThree = student.rank <= 3;
                    const rankStyle = [
                      styles.rankCircle,
                      student.rank === 1 && styles.rankGold,
                      student.rank === 2 && styles.rankSilver,
                      student.rank === 3 && styles.rankBronze,
                    ];
                    const containerStyle = [styles.leaderboardItem, student.isCurrentUser && styles.currentUserItem];

                    return (
                      <View key={student.rank} style={containerStyle}>
                        <View style={styles.leaderboardRow}>
                          <View style={rankStyle}>
                            {isTopThree ? (
                              <MaterialCommunityIcons name="trophy" size={14} color="white" />
                            ) : (
                              <Text style={styles.rankText}>
                                {student.rank}
                              </Text>
                            )}
                          </View>

                          <Text style={styles.leaderAvatar}>{student.avatar}</Text>

                          <View>
                            <Text style={styles.leaderName}>{student.name}</Text>
                            {student.isCurrentUser && <Text style={styles.youLabel}>You</Text>}
                          </View>
                        </View>

                        <View style={styles.pointsRowRight}>
                          <MaterialCommunityIcons name="medal-outline" size={16} color="#4a2e22" />
                          <Text style={styles.leaderPoints}>{student.points}</Text>
                        </View>
                      </View>
                    );
                  })}
              </View>
            )}
          </ScrollView>
        )
          : (
            <ScrollView>
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Course not found</Text>
              </View>
            </ScrollView>
          )}
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
    paddingBottom: 20,
    paddingTop: 0,
    justifyContent: 'center',
  },

  listContainer: {
    paddingBottom: 24,
    alignItems: 'stretch',
  },

  /* Tabs */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#4E342E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    textAlign: 'center'
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#f2e6b6',
    textAlign: 'center'
  },
  tabButtonText: {
    fontFamily: 'TitanOne',
    color: '#f2e6b6',
    opacity: 0.7,
    fontSize: 15,
  },
  activeTabButtonText: {
    color: '#f2e6b6',
    opacity: 1,
    fontSize: 15,
  },

  /* Course card (as header) */
  card: {
    backgroundColor: '#4a2e22',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    marginBottom: 16,

    marginLeft: 20,
    marginRight: 20,
  },
  cardHeader: {
    marginBottom: 12,
  },
  courseName: {
    color: '#f2e6b6',
    fontFamily: 'TitanOne',
    fontSize: 18,
    marginBottom: 4,
  },
  courseMeta: {
    color: '#f2e6b6',
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
    color: '#f2e6b6',
    fontFamily: 'Capriola',
    fontSize: 14,
    marginLeft: 6,
  },
  pointsValue: {
    color: '#f2e6b6',
    fontSize: 14,
    fontWeight: '700',
  },

  taskPointsLabel: {
    color: '#4a2e22',
    fontFamily: 'Capriola',
    fontSize: 14,
    marginLeft: 6,
  },
  taskPointsValue: {
    color: '#4a2e22',
    fontSize: 14,
    fontWeight: '700',
  },

  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f2e6b6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  scoreBadgeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },

  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#f2e6b680',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#93b5c6',
    borderRadius: 999,
  },

  /* Task card */
  taskCard: {
    backgroundColor: '#f2e6b6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    marginLeft: 20,
    marginRight: 20,
  },
  cardCompleted: {
    backgroundColor: '#ecfdf5',
    borderColor: '#bbf7d0',
  },
  cardLate: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  pointsValueRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  taskTitle: {
    fontSize: 16,
    color: '#4a2e22',
    fontFamily: 'TitanOne',
    flexShrink: 1,
  },
  taskDescription: {
    color: '#4a2e22',
    fontSize: 13,
    fontFamily: 'Capriola',
    marginBottom: 8,
  },

  taskMetaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#4a2e22',
    fontSize: 12,
    fontFamily: 'Capriola',
  },

  pointsContainer: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  progressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#4a2e2291',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFillTask: {
    height: '100%',
    backgroundColor: '#93b5c6',
    borderRadius: 999,
  },

  /* Leaderboard */
  leaderboardItem: {
    backgroundColor: '#f2e6b6',
    borderWidth: 1,
    borderColor: '#93B5C6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  currentUserItem: {
    backgroundColor: '#ded2a5',
    borderColor: '#93B5C6',
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankCircle: {
    width: 34,
    height: 34,
    borderRadius: 34,
    backgroundColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankGold: { backgroundColor: '#facc15' },
  rankSilver: { backgroundColor: '#9ca3af' },
  rankBronze: { backgroundColor: '#fb923c' },
  rankText: { color: '#374151', fontWeight: '700' },

  leaderAvatar: { fontSize: 20 },
  leaderName: { color: '#4a2e22', fontWeight: '700', fontSize: 15, fontFamily: 'TitanOne' },
  youLabel: { color: '#4a2e22', fontSize: 12, fontFamily: 'Capriola' },

  pointsRowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  leaderPoints: { color: '#4a2e22', fontWeight: '700', fontSize: 15 },

  /* Empty */
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { color: '#4b5563', fontSize: 16, fontWeight: '600' },
});