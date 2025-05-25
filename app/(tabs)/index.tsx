import { COLORS } from "@/commons/colors"
import { SCREEN_W } from '@/commons/size'
import ScreenWrapper from '@/components/app/ScreenWrapper'
import NetInfo from '@react-native-community/netinfo'
import { ImageBackground } from 'expo-image'
import { useRouter } from "expo-router"
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'


type Props = {}

const Page = (props: Props) => {

 const [syncMessage, setSyncMessage] = useState("");
 const router = useRouter();

 const checkNetWork = () => {
        NetInfo.fetch().then(state => {
            router.push("/(tabs)/scanner");
        });
} 

  return (
    <ScreenWrapper>
      <ImageBackground
            source={require("@/assets/digitBg4.jpg")}
            
            style={{
                flex: 1
            }}
        >
            <StatusBar backgroundColor={COLORS.primary} />
            
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent"
                }}
            >
                <Pressable
                    onPress={() => {
                         checkNetWork();
                    }}
                >
                    <Animated.View style={{
                        borderRadius: 95, 
                        padding: 2,
                        backgroundColor: COLORS.white,
                        // transform: [{ scale }],
                        borderWidth: 8,
                        borderColor: COLORS.vert,
                        marginRight: 40,
                        marginTop: 380
                    }}>
                        <View style={styles.scanBtnRounder}>
                            <Text style={styles.scanText}>Appuyez ici pour scanner votre QR Code</Text>
                        </View>
                    </Animated.View>
                </Pressable>
            </View>
            
            {/* Bouton de synchronisation (conservé comme dans le code original) */}
            <TouchableOpacity
                onPress={() => {
                    router.push("/(tabs)/synchronize");
                }}
                style={{
                    position: "absolute",
                    bottom: SCREEN_W * 0.5,
                    right: 140,
                    backgroundColor: COLORS.white,
                    width: 25,
                    height: 40,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    gap: 25
                }}
            >
                <Text style={{ color: COLORS.black, fontSize: 1 }}>...</Text>
            </TouchableOpacity>
            
            {/* Message de synchronisation */}
            {syncMessage ? (
                <View style={styles.syncMessageContainer}>
                    <Text style={styles.syncMessageText}>{syncMessage}</Text>
                </View>
            ) : null}
            
            {/* Indicateur de synchronisation automatique */}
            <View style={styles.autoSyncIndicator}>
                <Text style={styles.autoSyncText}>
                    Sync auto: 11h et 18h
                </Text>
            </View>
        </ImageBackground>
    </ScreenWrapper>
  )
}

export default Page

const styles = StyleSheet.create({
    btn: {
        marginBottom: 5,
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.white,
        paddingHorizontal: 1,
        paddingVertical: 2,
        width: 150,
        borderRadius: 30,
        backgroundColor: COLORS.fird
    },
    bottom: {
        alignItems: "center",
        backgroundColor: "red"
    },
    scanBtnRounder: {
        justifyContent: "center",
        alignItems: "center",
        width: 285,
        height: 285,
        borderRadius: 90,
        backgroundColor: COLORS.orange,
    },
    scanText: {
        color: COLORS.white,
        fontSize: 34,
        textAlign: "center",
    },
    nubrCardScan: {
        textAlign: "center",
        fontSize: 30,
        fontFamily: "padauk-bold",
        color: COLORS.black
    },
    nubrCardScanText: {
        textAlign: "center",
        fontSize: 30,
        fontFamily: "padauk-bold",
        color: COLORS.black
    },
    syncMessageContainer: {
        position: "absolute",
        top: 60,
        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 10,
        borderRadius: 5,
        elevation: 5,
    },
    syncMessageText: {
        color: COLORS.white,
        fontSize: 16,
        textAlign: "center",
    },
    autoSyncIndicator: {
        position: "absolute",
        bottom: 10,
        left: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 8,
        borderRadius: 5,
    },
    autoSyncText: {
        color: COLORS.white,
        fontSize: 12,
    }
});
