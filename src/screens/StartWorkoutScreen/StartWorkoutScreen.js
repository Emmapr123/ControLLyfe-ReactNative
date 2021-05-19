import React, { useState } from 'react';
import { useEffect } from 'react';
import { Vibration, StyleSheet, TextInput, Dimensions, View, Animated, TouchableOpacity, FlatListRef } from 'react-native';
import { WorkoutTitleComponent, IndividualExerciseComponent } from '../../components';
import { StartWorkoutButton } from '../../SVGs';

const AnimatedViewBar = ( props ) => {
  const { active, duration, onAnimationComplete } = props
  const { width, height } = Dimensions.get('window')
  const timerAnimation = React.useRef(new Animated.Value(0)).current;
  const inputRef = React.useRef();
  // const textInputAnimation = React.useRef(new Animated.Value(duration)).current;

  React.useEffect(() => {
    const listener = timerAnimation.addListener(({value}) => {
      console.log('duration', duration)
      console.log('value', value)
      inputRef?.current?.setNativeProps({
        text: Math.ceil(value * (1 - duration)).toString()
      })
    })

    return () => {
      timerAnimation.removeListener(listener)
      timerAnimation.removeAllListeners();
    }
  })

  // console.log('props', props)

  const countDown = timerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [duration, 0]
  })

  const animation = () => {

    // Animated.sequence([

      // Animated.timing(timerAnimation, {
      //   toValue: 0,
      //   duration: 300,
      //   useNativeDriver: true
      // }),
      Animated.timing(timerAnimation, {
        toValue: 1,
        duration: duration * 1000,
        useNativeDriver: true
      }).start(() => {
        console.log('here')
        onAnimationComplete()
      })
    // ])
  }

  const translate = timerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, height]
    })

  console.log(timerAnimation)

  React.useEffect(() => {
    if (active) {
      animation()
    }
  }, [active])

  return(
    <View style={{fles: 1}}>
    <Animated.View 
        style={ {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 20,
          width,
          backgroundColor: 'red',
          transform: [{
          translateY: translate}]
        }
        }/>
         <View style={{
            postition: 'absolute',
            justifyContent: 'center',
            width: width,
            alignSelf: 'center',
            alignItems: 'center'
          }}>
            <TextInput 
              ref={inputRef}
              style={styles.duration}
              defaultValue={duration.toString()}
            />
          </View>
        </View>
  )
}

const AnimatedCountDownComponent = ( props ) => {
  const { duration, active } = props
  const inputRef = React.useRef();
  const { width } = Dimensions.get('window')
  const ITEM_SIZE = width;
  const textInputAnimation = React.useRef(new Animated.Value(duration)).current;

  React.useEffect(() => {
    const listener = textInputAnimation.addListener(({value}) => {
      inputRef?.current?.setNativeProps({
        text: Math.ceil(value).toString()
      })
    })

    return () => {
      textInputAnimation.removeListener(listener)
      textInputAnimation.removeAllListeners();
    }
  })

  const animation = React.useCallback(() => {

    Animated.timing(textInputAnimation, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: true
    })
  }, [duration])

  useEffect(() => {
    if (active) {
      animation()
    }
  }, [active])

  return (
  <Animated.View style={{
    postition: 'absolute',
    justifyContent: 'center',
    width: ITEM_SIZE,
    alignSelf: 'center',
    alignItems: 'center'
  }}>
    <TextInput 
      ref={inputRef}
      style={styles.duration}
      defaultValue={duration.toString()}
    />
  </Animated.View>
  )
}

const StartWorkoutScreen = ( props ) => {
  const workout = props.route.params
  const exercises = props.route.params.exercises
  const id = props.route.params.id

  const { width, height } = Dimensions.get('window')

  const ITEM_SIZE = width;
  const ITEM_SPACING = (width - ITEM_SIZE);
  const [currentIndex, setCurrentIndex] = useState(0)

  const [duration, setDuration] = useState(exercises[currentIndex].duration);
  const inputRef = React.useRef();
  const timerAnimation = React.useRef(new Animated.Value(height)).current;
  const textInputAnimation = React.useRef(new Animated.Value(exercises[currentIndex].duration)).current;
  const scrollerAnimation = React.useRef(new Animated.Value(exercises[currentIndex].duration)).current;
  const [animating, setAnimating] = useState(false)

  // React.useEffect(() => {
  //   const listener = textInputAnimation.addListener(({value}) => {
  //     inputRef?.current?.setNativeProps({
  //       text: Math.ceil(value).toString()
  //     })
  //   })

  //   return () => {
  //     textInputAnimation.removeListener(listener)
  //     textInputAnimation.removeAllListeners();
  //   }
  // })

  // const animation = React.useCallback(() => {

  //   Animated.sequence([

      // Animated.timing(timerAnimation, {
      //   toValue: 0,
      //   duration: 300,
      //   useNativeDriver: true
      // }),

      // Animated.parallel([
        // Animated.timing(textInputAnimation, {
        //   toValue: 0,
        //   duration: duration * 1000,
        //   useNativeDriver: true
        // }),
        // Animated.timing(timerAnimation, {
        //   toValue: height,
        //   duration: duration * 1000,
        //   useNativeDriver: true
        // }),
        // Animated.timing(scrollerAnimation, {
        //   toValue: currentIndex,
        //   duration: duration * 1000,
        //   useNativeDriver: true
        // })
      // ]),
      // Animated.delay(300)
      // ]).start(() => {
      //   Vibration.cancel();
      //   Vibration.vibrate();
          // textInputAnimation.setValue(duration);
    //   }) 
    // }, [duration])

    const onAnimationComplete = () => {
      flatListRef.scrollToIndex({animated: true, index: currentIndex + 1})
    }

  return(
    <View style={{flex: 1}}>
       {/* <Animated.View 
        style={[StyleSheet.absoluteFillObject, {
          height,
          width,
          backgroundColor: 'pink',
          transform: [{
          translateY: timerAnimation}]
        }]

        }/> */}
      <View style={styles.workoutTitle}>
        <WorkoutTitleComponent key={id} {...workout}/>
      </View>
      <TouchableOpacity onPress={() => setAnimating(true)}>
          <StartWorkoutButton/>
        </TouchableOpacity>
      <View style={styles.flatList}>
        <Animated.FlatList 
        data={exercises}
        keyExtractor={exercises => exercises._id.toString()}
        horizontal
        bounces={false}
        onMomentumScrollEnd={ev => {
          const index = Math.round(ev.nativeEvent.contentOffset.x / ITEM_SIZE);
          setCurrentIndex(index)
          setDuration(exercises[index].duration)
        }}
        ref={(ref) => { flatListRef = ref; }}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        // style={StyleSheet.absoluteFillObject, {
        //   height: 400,
        //   width,
        // }}
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING,
        }}
        renderItem={({item, index}) => {

          return <View style={{width: ITEM_SIZE, alignItems: 'center', justifyContent: 'center', height: height, position: 'relative'}}>
          <AnimatedViewBar active={index === currentIndex && animating} {...item} {...{onAnimationComplete}}/> 
          <IndividualExerciseComponent exercise={item} />
          {/* <AnimatedCountDownComponent duration={item.duration} active={index === currentIndex && animating}/> */}
        </View>
        }}
        />
        {/* <Animated.View style={{
          postition: 'absolute',
          justifyContent: 'center',
          width: ITEM_SIZE,
          alignSelf: 'center',
          alignItems: 'center'
        }}>
          <TextInput 
            ref={inputRef}
            style={styles.duration}
            defaultValue={duration.toString()}
          /> */}
        {/* </Animated.View> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  workoutTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    margin: 10
  },
  flatList: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  duration: {
    fontSize: 40
  }
})

export { StartWorkoutScreen }