
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [quedas,setQuedas] = useState(null);
  const [location, setLocation] = useState<Location.LocationObject|null>(null);

  useEffect(() => {
    const subscription = Accelerometer.addListener(accelerometerData => {
      if(Math.abs(accelerometerData.x)>1.1 ||
      Math.abs(accelerometerData.y)>1.1 ||
      Math.abs(accelerometerData.z)>1.1) {
        setQuedas([...quedas,accelerometerData])
      }
      setData(accelerometerData);
      }
    });
    return () => subscription.remove();
  }, []);
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }
    })();
  }, []);
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Acelerômetro</Text>
      <Text style={styles.text}>Detector de Quedas</Text>
      <Text style={styles.text}>Latitude: {location?.coords.latitude} Longitude: {location?.coords.longitude}</Text>
      <Button title='Limpar' onProgress={()=>setQuedas([])} />
      <Text style={styles.text}>
      x: {(data.x.toFixed(2))}
      y: {(data.y.toFixed(2))}
      z: {(data.z.toFixed(2))}
      </Text>
    </View>
  );


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
});


Accelerometer.addListener(data => {
  console.log(data);
});

}