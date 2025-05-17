import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, } from "react-native";
import InfoBox from "../../../components/InfoBox";

export default function Home() {
    const temperatureData = 5;
    const humidityData = 50;

    const handleFoodPress = () => {
        router.navigate('./food');
    }

    return (
        <View
            style={styles.container}
        >
            <Text style={styles.containerHeader}>Cool Save</Text>
            <InfoBox 
                title="Temperature:" 
                value={`${temperatureData}° C`}
            />
            <InfoBox 
                title="Humidity:" 
                value={`${humidityData}%`}
            />
            <Pressable onPress={handleFoodPress} style={styles.foodContainer}>
                <View style={styles.leftFoodContainer}>
                    <MaterialIcons
                        name="food-bank"
                        size={40}
                    />
                    <Text style={styles.leftFoodContainerText}>Alimente</Text>
                </View>
                <MaterialIcons
                        name="arrow-forward"
                        size={40}
                    />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    containerHeader: {
        fontSize: 25,
        marginTop: 25
    },
    foodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        
    },
    leftFoodContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftFoodContainerText: {
        fontSize: 24,
    }
})