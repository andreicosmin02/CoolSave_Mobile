import { StyleSheet, Text, View } from "react-native";

export default function Home() {
    const temperatureData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                data: [5, 4, 6, 5, 4, 5, 3, 3, 4, 5]
            }
        ],
        legend: ['Temperature']
    }
    return (
        <View
            style={styles.container}
        >
            
            <Text style={styles.containerHeader}>Cool Save</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    containerHeader: {
        fontSize: 25,
        marginTop: 25
    }
})