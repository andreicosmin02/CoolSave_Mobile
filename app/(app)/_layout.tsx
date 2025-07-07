import { MaterialIcons } from '@expo/vector-icons';
import { Link, Stack } from "expo-router";
import { StatusBar, TouchableOpacity } from "react-native";

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
                    headerRight: () => (
                        <Link href="/(app)/food/add" asChild>
                            <TouchableOpacity style={{ marginRight: 16 }}>
                                <MaterialIcons name="add" size={24} color="black" />
                            </TouchableOpacity>
                        </Link>
                    ),
                }}/>
                <Stack.Screen name='food/add/index' options={{
                    title: 'Add Food Page',
                }}/>
                <Stack.Screen name='food/edit/[product]' options={{
                    title: 'Edit Food Page',
                }}/>
                <Stack.Screen name='recipe/index' options={{
                    title: 'Recipe Page',
                }}/>
            </Stack>
        </>  
    );
}