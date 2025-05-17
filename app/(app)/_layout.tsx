import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function AppLayout() {
    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <Stack>
                <Stack.Screen name='home/index' options={{
                    title: 'Home Page',
                    headerShown: false,
                }}/>
                <Stack.Screen name='food/index' options={{
                    title: 'Food Page',
                    // headerShown: false,
                }}/>
            </Stack>
        </>  
    );
}