import { Redirect } from "expo-router";
import { fetch } from 'expo/fetch';
import { useEffect } from "react";
// import dotenv from 'dotenv';


export default function Index() {

  useEffect(() => {
    console.log(process.env.EXPO_PUBLIC_API_URL)
    const checkHealth = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}health`);
        const data = await response.json();
        console.log('Health check:', data);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    checkHealth();
  }, []);
  return (
    <Redirect href='./home'/>
  );
}
