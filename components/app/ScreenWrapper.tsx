import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

type Props = {
 children?: React.ReactNode
}

const ScreenWrapper = ({ children }: Props) => {
  return (
    <Animated.View entering={FadeIn} style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      {children}
    </Animated.View>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({})