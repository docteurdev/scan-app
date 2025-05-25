import { storeData } from '@/commons/utiles'
import CustomButton from '@/components/app/CustomBtn'
import CustomInput from '@/components/app/CustomInput'
import ScreenWrapper from '@/components/app/ScreenWrapper'
import { alterAuth } from '@/redux/auth'
import React, { useEffect, useState } from 'react'
import {
 Dimensions,
 EmitterSubscription,
 Image,
 Keyboard,
 KeyboardAvoidingView,
 Platform,
 ScrollView,
 StyleSheet,
 Text,
 View
} from 'react-native'
import { useDispatch } from 'react-redux'

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')

type Props = {}

const register = (props: Props) => {
  const [site, setSite] = useState('')
  const [code, setCode] = useState('')
  const [numero, setNumero] = useState('')
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const dispatch = useDispatch();

  // Keyboard event listeners
  useEffect(() => {
    let keyboardDidShowListener: EmitterSubscription
    let keyboardDidHideListener: EmitterSubscription

    if (Platform.OS === 'ios') {
      keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', (event) => {
        setKeyboardHeight(event.endCoordinates.height)
        setIsKeyboardVisible(true)
      })
      keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
        setKeyboardHeight(0)
        setIsKeyboardVisible(false)
      })
    } else {
      keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
        setKeyboardHeight(event.endCoordinates.height)
        setIsKeyboardVisible(true)
      })
      keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0)
        setIsKeyboardVisible(false)
      })
    }

    return () => {
      keyboardDidShowListener?.remove()
      keyboardDidHideListener?.remove()
    }
  }, [])

  // Add your insertData function here
  const insterData = () => {
    console.log('Inserting data:', { site, code, numero });
    storeData('t_info',{site, code, numero}, dispatch(alterAuth(true)))
    // Your data insertion logic here
    Keyboard.dismiss() // Dismiss keyboard after submission
  }

  // Validation
  const isValid = code && site && numero

  // Dynamic styles based on keyboard state
  const getDynamicStyles = () => {
    const isLandscape = SCREEN_W > SCREEN_H
    
    return {
      logoStyle: [
        styles.logo,
        isKeyboardVisible && isLandscape && {
          height: SCREEN_W * 0.08, // Smaller logo when keyboard is visible in landscape
          marginVertical: SCREEN_W * 0.01,
        }
      ],
      formContainerStyle: [
        styles.formContainer,
        isKeyboardVisible && isLandscape && {
          paddingVertical: 10, // Reduced padding in landscape with keyboard
        }
      ],
      inputContainerStyle: [
        styles.inputContainer,
        isKeyboardVisible && isLandscape && {
          marginBottom: SCREEN_H * 0.015, // Tighter spacing when keyboard is visible
        }
      ]
    }
  }

  const dynamicStyles = getDynamicStyles()

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        enabled={true}
      >
        <View style={styles.container}>
          <Image 
            source={require('@/assets/lunchicons/log1.png')}
            style={dynamicStyles.logoStyle}
            resizeMode="contain"
          />
          
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={[
              styles.scrollContent,
              isKeyboardVisible && { paddingBottom: keyboardHeight * 0.1 }
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            scrollEnabled={true}
            bounces={false}
            keyboardDismissMode="interactive"
          >
            <View style={dynamicStyles.formContainerStyle}>
              <CustomInput
                value={site}
                onChangeText={setSite}
                label="Site"
                placeholder="Entrez le nom du site"
                containerStyle={dynamicStyles.inputContainerStyle}
                leftIcon={<View style={styles.iconContainer}><Text style={styles.iconText}>🏢</Text></View>}
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <CustomInput
                value={code}
                onChangeText={setCode}
                label="Code du Site"
                placeholder="Entrez le code du site"
                containerStyle={dynamicStyles.inputContainerStyle}
                leftIcon={<View style={styles.iconContainer}><Text style={styles.iconText}>#</Text></View>}
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <CustomInput
                value={numero}
                onChangeText={setNumero}
                label="Numéro tablette"
                placeholder="Entrez le numéro de la tablette"
                containerStyle={dynamicStyles.inputContainerStyle}
                keyboardType="numeric"
                leftIcon={<View style={styles.iconContainer}><Text style={styles.iconText}>📱</Text></View>}
                returnKeyType="done"
                onSubmitEditing={() => isValid && insterData()}
              />

              <CustomButton
                title="Enregistrer"
                onPress={() => isValid ? insterData() : null}
                disabled={!isValid}
                variant={isValid ? 'primary' : 'outline'}
                size="large"
                buttonStyle={[
                  styles.submitButton,
                  { backgroundColor: isValid ? 'green' : 'transparent' },
                  isKeyboardVisible && styles.submitButtonKeyboardVisible
                ]}
                textStyle={[
                  styles.submitButtonText,
                  { color: isValid ? 'white' : 'gray' }
                ]}
                leftIcon={isValid ? <View style={styles.buttonIcon}><Text style={styles.buttonIconText}>✓</Text></View> : null}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default register

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  
  container: {
    flex: 1,
  },
  
  logo: {
    width: SCREEN_W * 0.55,
    height: SCREEN_W * 0.15,
    alignSelf: "center",
    marginVertical: SCREEN_W * 0.03,
  },
  
  scrollContainer: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_W * 0.05,
    minHeight: SCREEN_H * 0.6, // Ensure minimum height for proper scrolling
  },
  
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  
  inputContainer: {
    marginBottom: SCREEN_H * 0.025,
  },
  
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  iconText: {
    fontSize: 18,
    color: '#007AFF',
  },
  
  submitButton: {
    marginTop: SCREEN_H * 0.04,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  submitButtonKeyboardVisible: {
    marginTop: SCREEN_H * 0.02, // Reduced margin when keyboard is visible
  },
  
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  buttonIcon: {
    marginRight: 8,
  },
  
  buttonIconText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
})