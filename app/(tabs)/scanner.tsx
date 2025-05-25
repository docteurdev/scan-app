import { getItems, insertItem } from '@/commons/sqlite';
import { queryKeys } from '@/constants/queryKeys';
import { IPhoneInfo } from '@/redux/auth';
import NetInfo from '@react-native-community/netinfo';
import { useQuery } from '@tanstack/react-query';
import { useAudioPlayer } from 'expo-audio';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
 Dimensions,
 Platform,
 StatusBar,
 StyleSheet,
 Text,
 TouchableOpacity,
 Vibration,
 View
} from 'react-native';
import Animated, {
 interpolate,
 useAnimatedStyle,
 useSharedValue,
 withRepeat,
 withSequence,
 withTiming
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// soundPaths.ts
export const SOUND_PATHS = {
  bad: require('@/assets/son/bad.mp3'),
  bonjour: require('@/assets/son/bonjour.mp3'),
  bonsoir: require('@/assets/son/bonsoir.mp3'),
  bon_apres_midi: require('@/assets/son/bon_apres_midi.mp3'),
  bonne_degustation: require('@/assets/son/bonne_degustation.mp3'),
  alert12: require('@/assets/son/alert12.mp3'),
  alert13: require('@/assets/son/alert13.mp3'),
  bonne_soire: require('@/assets/son/bonne_soire.mp3'),
  alert16: require('@/assets/son/alert16.mp3'),
  manque_matin: require('@/assets/son/manque_matin.mp3'),
  erreur_qrcode: require('@/assets/son/erreur_qrcode.mp3'),
};


interface QRScannerProps {
  onScanSuccess?: (data: string) => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScanSuccess,
  onClose,
  title = "Scanner QR Code",
  subtitle = "Positionnez le code QR dans le cadre"
}) => {
  // All hooks must be called in the same order every time
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const phoneInfo = useSelector(state => state?.auth?.phoneInfo) as IPhoneInfo ;

  
  // Animation values - always initialize these
  const scanLineAnimation = useSharedValue(0);
  const cornerAnimation = useSharedValue(0);
  const successAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);

  const {data: dbData, isLoading, error} = useQuery({
    queryKey: queryKeys.getAll,
    queryFn: async () => {
     const data = await getItems();
     
     return data;
    },
  });

  // Refs
  const cameraRef = useRef<CameraView>(null);

  // Sound imports - ensure these are imported correctly
const playerBad = useAudioPlayer(SOUND_PATHS.bad);
const playerBonjour = useAudioPlayer(SOUND_PATHS.bonjour);
const playerBonsoir = useAudioPlayer(SOUND_PATHS.bonsoir);
const playerApresMidi = useAudioPlayer(SOUND_PATHS.bon_apres_midi);
const playerDegustation = useAudioPlayer(SOUND_PATHS.bonne_degustation);
const playerAlert12 = useAudioPlayer(SOUND_PATHS.alert12);
const playerAlert13 = useAudioPlayer(SOUND_PATHS.alert13);
const playerBonneSoire = useAudioPlayer(SOUND_PATHS.bonne_soire);
const playerAlert16 = useAudioPlayer(SOUND_PATHS.alert16);
const playerManqueMatin = useAudioPlayer(SOUND_PATHS.manque_matin);
const playerErrorQR = useAudioPlayer(SOUND_PATHS.erreur_qrcode);

const [isValid, setIsValid] = React.useState (false);

const [ShowUser, setShowUser] = useState(false)

const [alertMessage, setalertMessage] = useState("");



  // Callbacks - define these before useEffect
  const handleBarCodeScanned = useCallback(({ type, data }: { type: string; data: string }) => {
    if (!isScanning) return;
    
    setIsScanning(false);
    setScannedData(data);
    userCarteScanned(data);
    console.log(`Scanned data: ${data} of type ${type}`);
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Vibration.vibrate(100);
    } else {
      Vibration.vibrate([0, 100]);
    }

    // Success animation
    successAnimation.value = withTiming(1, { duration: 500 });

    // Handle success
    setTimeout(() => {
      onScanSuccess?.(data);
    }, 1000);
  }, [isScanning, onScanSuccess, successAnimation]);

  const resetScanner = useCallback(() => {
    setIsScanning(true);
    setScannedData(null);
    successAnimation.value = withTiming(0, { duration: 300 });
  }, [successAnimation]);

  const toggleFlash = useCallback(() => {
    setFlashOn(prev => !prev);
  }, []);

  // Effects - always call these in the same order
  useEffect(() => {
    // Start animations
    scanLineAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
    
    cornerAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.7, { duration: 1000 })
      ),
      -1,
      true
    );

    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, [scanLineAnimation, cornerAnimation, pulseAnimation]);

  // Animated styles
  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scanLineAnimation.value,
            [0, 1],
            [0, 200]
          ),
        },
      ],
      opacity: interpolate(
        scanLineAnimation.value,
        [0, 0.5, 1],
        [0.3, 1, 0.3]
      ),
    };
  });

  const cornerStyle = useAnimatedStyle(() => {
    return {
      opacity: cornerAnimation.value,
      transform: [{ scale: cornerAnimation.value }],
    };
  });

  const successStyle = useAnimatedStyle(() => {
    return {
      opacity: successAnimation.value,
      transform: [{ scale: successAnimation.value }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: 1 + (pulseAnimation.value * 0.1) }
      ],
      opacity: 1 - (pulseAnimation.value * 0.3),
    };
  });


  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  async function playSoundBad() {
  playerBad.play();
  setTimeout(() => playerBad.pause(), 1000);
}

async function playSoundBonjour() {
   playerBonjour.play();
  setTimeout(() => playerBonjour.pause(), 2000);
}

async function playSoundBonsoir() {
   playerBonsoir.play();
  setTimeout(() => playerBonsoir.pause(), 2000);
}

async function playSoundBonApresMidi() {
   playerApresMidi.play();
  setTimeout(() => playerApresMidi.pause(), 2000);
}

async function playSoundBonneDegustation() {
   playerDegustation.play();
  setTimeout(() => playerDegustation.pause(), 2000);
}

async function playSoundAlert12() {
   playerAlert12.play();
  setTimeout(() => playerAlert12.pause(), 3000);
}

async function playSoundAlert13() {
   playerAlert13.play();
  setTimeout(() => playerAlert13.pause(), 3000);
}

async function playSoundBonneSoire() {
   playerBonneSoire.play();
  setTimeout(() => playerBonneSoire.pause(), 3000);
}

async function playSoundAlert16() {
   playerAlert16.play();
  setTimeout(() => playerAlert16.pause(), 3000);
}

async function playSounMmatin() {
   playerManqueMatin.play();
  setTimeout(() => playerManqueMatin.pause(), 3000);
}

async function playSoundErrorQR() {
   playerErrorQR.play();
  setTimeout(() => playerErrorQR.pause(), 4000);
}

  // Fin des fonctions sonores

  // verification pointage 
    // Vérif avant 12 
    const verifBefore12 = (idcarte,datepointage) =>{
      let dd =  dbData?.filter(d => d.qrinfo == idcarte &&
      d.day == datepointage &&  new Date('1970-01-01T' + d.time + 'Z') < new Date('1970-01-01T' + "12:00:00" + 'Z'))
      if(dd.length > 0){
        return false
      }else{
        return true
      }
    }

    // Vérif apres 12 et avant 13
    const verifAfter12Before13 = (idcarte,datepointage) =>{
      let dd =  dbData.filter(d => d.qrinfo == idcarte &&
      d.day == datepointage &&  new Date('1970-01-01T' + d.time + 'Z') > new Date('1970-01-01T' + "12:00:00" + 'Z') &&
      new Date('1970-01-01T' + d.time + 'Z') < new Date('1970-01-01T' + "13:00:00" + 'Z'))
      if(dd.length > 0){
        return false
      }else{
        return true
      }
    }

    // Vérif apres 13 et avant 16
    const verifAfter13Before16 = (idcarte,datepointage) =>{
      let dd =  dbData.filter(d => d.qrinfo == idcarte &&
      d.day == datepointage &&  new Date('1970-01-01T' + d.time + 'Z') > new Date('1970-01-01T' + "13:00:00" + 'Z') &&
      new Date('1970-01-01T' + d.time + 'Z') < new Date('1970-01-01T' + "16:30:00" + 'Z'))
      if(dd.length > 0){
        return false
      }else{
        return true
      }
    }

    // Vérif apres 16h30
    const verifAfter16 = (idcarte,datepointage) =>{
      let dd =  dbData.filter(d => d.qrinfo == idcarte &&
      d.day == datepointage &&  new Date('1970-01-01T' + d.time + 'Z') > new Date('1970-01-01T' + "16:30:00" + 'Z'))
      if(dd.length > 0){
        return false
      }else{
        return true
      }
    }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const userCarteScanned = async (idCarte: string) =>{
    // Objet qui comporte les informations qrcode et les informations de configuration de la tablette 
    let data = {
      code : idCarte.replace(/^\.+|\.+$/g, ''), 
      site :  phoneInfo.site,
      num_tab : phoneInfo.numero,
      code_site : phoneInfo.code,
    }
    // console.log("pppppppppppppppp",idCarte);
    //les informations sur l'heur courante , la date courante 
    let date = new Date();
    let day = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    let hour = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    //Verification des pointages 
    let verif    = verifBefore12(idCarte,day);
    let verif2   = verifAfter12Before13(idCarte,day);
    let verif3   = verifAfter13Before16(idCarte,day);
    let verif4   = verifAfter16(idCarte,day);


        NetInfo.fetch().then(async (state) => {

        //const insertPointage = async (hour, day, idCarte,site, num_tab, code_site,data) => {
          // if(!state.isConnected){
           // insertItem(hour, day, idCarte,site, num_tab, code_site,0);
            //return
          // }else{
          //   //insertItem(hour, day, idCarte,site, num_tab, code_site);  
          //   axios.post("http://160.155.228.202:3000/pointageInsert", data).then(resp =>{
          //     insertItem(hour, day, idCarte,site, num_tab, code_site,1);
          //     console.log(resp.data);
          //   }).catch(error =>{
          //     insertItem(hour, day, idCarte,site, num_tab, code_site,0);
          //   })
        // }
       // }

       // Fonction d' insertion des données dans la base de données Sqlite
        const insertPointage = async (hour, day, idCarte,site, num_tab, code_site,data) => {
              insertItem(hour, day, idCarte,site, num_tab, code_site,0);
        }
       // La condition vérifie si le site est définit dans le QRcode 
      //  if(!(idCarte.split("_")[4] == undefined)){
          //comparaison de site de la tablette et le site des agents 

          // let getSite,siteStorage,verifSite;
          // if(!(idCarte.split("_")[4] == undefined)){
          //  getSite = idCarte.split("_")[4].replace(/\s+/g, ''); 
          //  siteStorage = phoneInfo.site.replace(/\s+/g, '');
          //  verifSite = getSite !== siteStorage;
          // }

          let infoQr = idCarte.split("_");

          const totalMinutesNow = date.getHours() * 60 + date.getMinutes();
          const douzeheur = 12 * 60 ; 
          const treizheur = 13 * 60 ; 
          const seizeheurTrente = 16 * 60 + 30 ; 
          // les controles sur les heurs de pointage 
         // new Date('1970-01-01T' + "16:30:00" + 'Z')
          if(totalMinutesNow < douzeheur){
            if(verif ){
              setIsValid(true);
              playSoundBonjour();
              setShowUser(true);
              insertPointage(hour, day, idCarte, phoneInfo.site, phoneInfo.numero, phoneInfo.code,data);
              setalertMessage("Bonjour, "+infoQr[2]);
              setTimeout(() =>{
                  setShowUser(false)
                  setIsValid(false);
                  // navigation.navigate("home");
               },2500)
            }
            else{
                setIsValid(false);
                playSoundAlert12();
                setShowUser(true);
                setalertMessage('Votre prochain pointage est prévu à partir de  12:00');
                setTimeout(() =>{
                  setShowUser(false)
                  setIsValid(null);
                  // navigation.navigate("home");
                },2500)      
            }
           }
           else if(totalMinutesNow >= douzeheur && totalMinutesNow < treizheur){
             if(verif2 ){
               setIsValid(true);
              !verif ? playSoundBonneDegustation() :playSounMmatin();
               setShowUser(true);
               insertPointage(hour, day, idCarte, phoneInfo.site, phoneInfo.numero, phoneInfo.code,data);
               setalertMessage("Bonne dégustation, "+infoQr[2]);
               setTimeout(() =>{
                   setShowUser(false)
                   setIsValid(null);
                   // navigation.navigate("home");
                },2500)
             }else{
              setIsValid(false);
              playSoundAlert13();
              setShowUser(true);
              setalertMessage('Votre prochain pointage est prévu à partir de  13:00');
              setTimeout(() =>{
                setShowUser(false)
                setIsValid(null);
                // navigation.navigate("home");
              },2500)
             }
           }else if(totalMinutesNow >= treizheur && totalMinutesNow < seizeheurTrente )
           {
             if(verif3 ){
               setIsValid(true);
               playSoundBonApresMidi();
               setShowUser(true);
               insertPointage(hour, day, idCarte, phoneInfo.site, phoneInfo.numero, phoneInfo.code,data);
               setalertMessage("Bon après-midi, "+ infoQr[2]);
               setTimeout(() =>{
                   setShowUser(false)
                   setIsValid(null);
                   // navigation.navigate("home");
                },2500)
             }else{
              setIsValid(false);
              playSoundAlert16();
              setShowUser(true);
              setalertMessage('Votre prochain pointage est prévu à partir de  16:30');
              setTimeout(() =>{
                setShowUser(false)
                setIsValid(null);
                // navigation.navigate("home");
              },2500)
             }
           }else if(totalMinutesNow >= seizeheurTrente){
             if(verif4 ){
               setIsValid(true);
               playSoundBonneSoire();
               setShowUser(true);
               insertPointage(hour, day, idCarte, phoneInfo.site, phoneInfo.numero, phoneInfo.code,data);
               setalertMessage("Passez une excellente soirée, "+ infoQr[2]);
               setTimeout(() =>{
                   setShowUser(false)
                   setIsValid(null);
                   // navigation.navigate("home");
                },2500)
             }else{
              setIsValid(false);
              playSoundBad();
              setShowUser(true);
              setalertMessage('Vous avez déjà effectué vos  pointages du jour');
              setTimeout(() =>{
                setShowUser(false)
                setIsValid(null);
                // navigation.navigate("home");
              },2000)
             }
           }
          // =======
        // }else{
        //   setIsValid(false);
        //   playSoundErrorQR();
        //   setShowUser(true);
        //   setalertMessage('Votre code QR est invalide. Veuillez contacter les administrateurs');
        //   setTimeout(() =>{
        //     setShowUser(false)
        //     setIsValid(null);
        //     navigation.navigate("home");
        //   },2000)
        // }
      });
  }


  // Permission handling - render early returns after all hooks
  if (!permission) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <StatusBar barStyle="light-content" translucent />
        <BlurView intensity={20} style={styles.permissionBlur}>
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Camera Permission Required</Text>
            <Text style={styles.permissionText}>
              We need access to your camera to scan QR codes
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />
      
      {/* Status bar background for edge-to-edge */}
      <View style={styles.statusBarBackground} />
      
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417'],
        }}
        flash={flashOn ? 'on' : 'off'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={onClose}>
            <Text style={styles.headerButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={toggleFlash}>
            <Text style={styles.headerButtonText}>{flashOn ? '🔦' : '💡'}</Text>
          </TouchableOpacity>
        </View>

        {/* Scanning Frame */}
        <View style={styles.scannerContainer}>
          <View style={styles.overlay}>
            {/* Top overlay */}
            <View style={styles.overlayTop} />
            
            {/* Middle section with scanning frame */}
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              
              {/* Scanning frame */}
              <View style={styles.scanningFrame}>
                {/* Corner indicators */}
                <Animated.View style={[styles.corner, styles.cornerTopLeft, cornerStyle]} />
                <Animated.View style={[styles.corner, styles.cornerTopRight, cornerStyle]} />
                <Animated.View style={[styles.corner, styles.cornerBottomLeft, cornerStyle]} />
                <Animated.View style={[styles.corner, styles.cornerBottomRight, cornerStyle]} />
                
                {/* Scanning line */}
                {isScanning && (
                  <Animated.View style={[styles.scanLine, scanLineStyle]} />
                )}

                {/* Success indicator */}
                {scannedData && (
                  <Animated.View style={[styles.successIndicator, successStyle]}>
                    <Text style={styles.successText}>✓</Text>
                  </Animated.View>
                )}
              </View>
              
              <View style={styles.overlaySide} />
            </View>
            
            {/* Bottom overlay */}
            <View style={styles.overlayBottom} />
          </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.controlsContent}>
            {scannedData ? (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Code scanné :</Text>
                <Text style={styles.resultText} numberOfLines={2}>
                  {scannedData}
                </Text>
                <TouchableOpacity style={styles.rescanButton} onPress={resetScanner}>
                  <Text style={styles.rescanButtonText}>Scanner à nouveau</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Animated.View style={[styles.scanningIndicator, pulseStyle]}>
                  <View style={styles.scanningDot} />
                </Animated.View>
                <Text style={styles.instructionText}>
                  Maintenez l'appareil stable et centrez le code QR
                </Text>
              </>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
};

// Example usage component - This will be the default export
const QRScannerPage: React.FC = () => {
  const [showScanner, setShowScanner] = useState(true);

  const handleScanSuccess = useCallback((data: string) => {
   router.push("/(tabs)");
    // Alert.alert(
    //   'QR Code Scanné',
    //   // `Données: ${data}`,
    //   "Votre QR Code a été scanné avec succès",
    //   [
    //     { text: 'Scanner à nouveau', onPress: () => setShowScanner(true) },
    //     { text: 'Fermer', onPress: () => setShowScanner(false) }
    //   ]
    // );
  }, []);

  const handleClose = useCallback(() => {
    setShowScanner(false);
  }, []);

  const handleStart = useCallback(() => {
    setShowScanner(true);
  }, []);

  if (!showScanner) {
    return (
      <View style={styles.startContainer}>
        <StatusBar barStyle="light-content" translucent />
        <View style={styles.statusBarBackground} />
        <Text style={styles.startTitle}>QR Code Scanner</Text>
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>Démarrer le scan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <QRScanner
      onScanSuccess={handleScanSuccess}
      onClose={handleClose}
      title="Scanner QR Code"
      subtitle="Positionnez le code dans le cadre"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  statusBarBackground: {
    height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  
  camera: {
    flex: 1,
  },

  // Permission styles
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  permissionBlur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  permissionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
  },
  
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  permissionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    opacity: 0.8,
  },
  
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },

  // Scanner styles
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  
  overlayMiddle: {
    flexDirection: 'row',
    height: 250,
  },
  
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  
  scanningFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00FF88',
    borderWidth: 4,
  },
  
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  
  cornerTopRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#00FF88',
    borderRadius: 2,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  
  successIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 80,
    height: 80,
    marginTop: -40,
    marginLeft: -40,
    backgroundColor: '#00FF88',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  successText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },

  // Bottom controls
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  
  controlsContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  scanningIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  scanningDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00FF88',
  },
  
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  
  resultContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  
  resultLabel: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  
  resultText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  rescanButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  
  rescanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Start screen styles
  startContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  startTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

// This is the required default export
export default QRScannerPage;