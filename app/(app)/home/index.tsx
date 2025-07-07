import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import InfoBox from "../../../components/InfoBox";

export default function Home() {
    const [temperature, setTemperature] = useState("...");
    const [humidity, setHumidity] = useState("...");
    const [expiredStats, setExpiredStats] = useState({
        percent: '...',
        topCategory: '...',
    });

    const fetchSensorData = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}api/sensors/latest`);
            const data = await response.json();
            setTemperature(data.temperature);
            setHumidity(data.humidity);
        } catch (error) {
            console.error("Failed to fetch sensor data:", error);
        }
    };

    const fetchFoodStats = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}api/food-products`);
            const data = await response.json();

            const today = new Date().setHours(0, 0, 0, 0);

            const expired = data.filter((item: any) => 
                new Date(item.expirationDate).setHours(0, 0, 0, 0) <= today
            );

            const percentExpired = data.length > 0
                ? ((expired.length / data.length) * 100).toFixed(1)
                : '0';

            const categoryCount: Record<string, number> = {};
            expired.forEach((item: any) => {
                categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
            });

            const topCategory = Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

            setExpiredStats({
                percent: `${percentExpired}%`,
                topCategory,
            });
        } catch (error) {
            console.error("Failed to fetch food stats:", error);
        }
    };

    useEffect(() => {
        fetchSensorData();
        fetchFoodStats();

        const interval = setInterval(() => {
            fetchSensorData();
            fetchFoodStats();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleFoodPress = () => router.navigate('./food');
    const handleRecipePress = () => router.navigate('./recipe');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.containerHeader}>Cool Save</Text>

            <View style={styles.infoRow}>
                <View style={styles.infoBoxWrapper}>
                    <InfoBox title="Temperature:" value={temperature} />
                </View>
                <View style={styles.infoBoxWrapper}>
                    <InfoBox title="Humidity:" value={humidity} />
                </View>
            </View>

            <InfoBox 
                title="Expired Food Stats:" 
                value={`Expired: ${expiredStats.percent}\nTop Category: ${expiredStats.topCategory}`} 
            />

            <View style={styles.menuContainer}>
                <Pressable onPress={handleFoodPress} style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <MaterialIcons name="food-bank" size={30} />
                        <Text style={styles.menuItemText}>Alimente</Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={28} />
                </Pressable>

                <Pressable onPress={handleRecipePress} style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <MaterialIcons name="receipt" size={30} />
                        <Text style={styles.menuItemText}>Retete</Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={28} />
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
    },
    containerHeader: {
        fontSize: 32,
        fontWeight: "600",
        marginBottom: 30,
        textAlign: "center",
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    infoBoxWrapper: {
        flex: 1,
        paddingHorizontal: 5,
    },
    menuContainer: {
        gap: 15,
        marginTop: 30,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderRadius: 12,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 20,
        marginLeft: 12,
        fontWeight: "500",
    },
});
