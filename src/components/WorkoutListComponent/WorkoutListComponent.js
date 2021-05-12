import React from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const WorkoutListComponent = ({
  workoutTitle,
}) => {

  return( 
    <SafeAreaView>
      <Text style={styles.title}>{workoutTitle}</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    color: 'darkgray',
    fontSize: 32,
    margin: 16,
  }
})

export { WorkoutListComponent }