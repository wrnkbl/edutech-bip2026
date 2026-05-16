import TabCoursesIcon from '@/app/components/Icons/TabCoursesIcon';
import TabProfileIcon from '@/app/components/Icons/TabProfileIcon';
import TabShopIcon from '@/app/components/Icons/TabShopIcon';
import TabStockIcon from '@/app/components/Icons/TabStockIcon';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#F2E6B6',
        tabBarInactiveTintColor: '#f2e6b6b4',
        tabBarStyle: {
          backgroundColor: '#4A2E22',
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'courses',
          tabBarIcon: ({ color }) => <TabCoursesIcon color={color} size={55} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'shop',
          tabBarIcon: ({ color }) => <TabShopIcon color={color} size={55} />,
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: 'stock',
          tabBarIcon: ({ color }) => <TabStockIcon color={color} size={55} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color }) => <TabProfileIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="[courseView]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
