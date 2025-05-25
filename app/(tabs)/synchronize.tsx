import { SCREEN_H } from '@/commons/size'
import { deleteAllPointageRecords, getItemsNonSynchro } from '@/commons/sqlite'
import CustomButton from '@/components/app/CustomBtn'
import { queryKeys } from '@/constants/queryKeys'
import { TPointage } from '@/interfaces'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

const Synchronize = () => {
  // const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const phoneInfo = useSelector((state) => state.auth.phoneInfo);

  const {data, isLoading: isLoading0, error: error0, refetch: refetch0} = useQuery<TPointage[]>({
      queryKey: queryKeys.getAll0,
      queryFn: async () => {
       const dd = await getItemsNonSynchro();
       
       return dd;
      },
    });
  
  // const fetchNonSyncData = async() => {
  //  const data = await getItemsNonSynchro();
  //  setData(data);
  //  console.log(data);
  // };

  useEffect(() => {
    // fetchNonSyncData();
    return () => {
      // Cleanup if needed
    }
  }, []);

  function synchronizeData() {
    setIsLoading(true);
    setSyncSuccess(false);
    
    const payload = {
      phoneInfo, 
      data: JSON.stringify(data)
    };
    
    axios.post("https://pointageapi.stats.ci/synchronisation", payload)
      .then(resp => {
        console.log(resp.data);
        // updateAllSynchro();
        // fetchNonSyncData();
        setSyncSuccess(true);
        setError("");
      })
      .catch(err => {
        if(axios.isAxiosError(err)){

          console.log(err);
          setError("Échec de la synchronisation. Veuillez réessayer.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function clearDatabase() {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir vider la base de données ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Confirmer",
          onPress: () => {
            setIsLoading(true)
            deleteAllPointageRecords();
            refetch0();
            
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Synchronisation</Text>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      {syncSuccess ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Synchronisation réussie!</Text>
        </View>
      ) : null}
      
      <ScrollView style={styles.scrollView}>
        {data?.length === 0 ? (
          <Text style={styles.emptyText}>Aucune donnée à synchroniser</Text>
        ) : (
          data?.map((x, i) => (
            <View key={i} style={styles.dataItem}>
              <Text>Date: {x?.day}</Text>
              <Text>Heure: {x?.time}</Text>
              <Text>Info QR code: {x?.qrinfo}</Text>
            </View> 
          ))
        )}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <CustomButton
          title={isLoading ? "Synchronisation en cours..." : "Synchroniser"}
          // variant={data?.length > 0 ? "green" : "#ccc"}
          onPress={synchronizeData}
          disabled={isLoading || data?.length === 0}
        />
        
        <CustomButton
          title="Vider la base de données"
          variant="secondary"
          onPress={clearDatabase}
          disabled={isLoading}
          style={styles.clearButton}
        />
      </View>
      
      {isLoading0 && (
        <ActivityIndicator size="large" color="green" style={styles.loader} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "white", 
    padding: SCREEN_H * 0.02
  },
  title: {
    marginVertical: 20, 
    textAlign: "center", 
    fontSize: SCREEN_H * 0.04, 
    fontFamily: "fontBold"
  },
  scrollView: {
    backgroundColor: "white",
    marginBottom: 10,
    flex: 1
  },
  dataItem: {
    marginVertical: 7, 
    borderWidth: 2, 
    borderColor: "#d3d3d3", 
    borderRadius: 10, 
    padding: 10
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666"
  },
  errorContainer: {
    backgroundColor: "#ffecec",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  errorText: {
    color: "red"
  },
  successContainer: {
    backgroundColor: "#e7f7e7",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  successText: {
    color: "green"
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{translateX: -25}, {translateY: -25}]
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10
  },
  clearButton: {
    marginTop: 10
  }
})
export default Synchronize
