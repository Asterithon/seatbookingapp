import { StyleSheet } from "react-native";

export const colors = {
    primary: "#073477",
    secondary: "#2196F3",
    tertiary: "#d4eaf9",
    background: "#f9f9f9",
    ground: "#dee5ef",
    text: "#333",
    textSecondary: "#727272",
    white: "#fff",
    gray: "#cdcdcd",
    lightGray: "#f0f0f0",
    dark: "#1f2425",
    black: "#101010",
};

export const globalStyles = StyleSheet.create({
    // Layout
    container: {
        flexGrow: 1,
        gap: 15,
        backgroundColor: colors.ground,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    blockHorizontal: {
        flexDirection: "row",
        borderRadius: 10,
        width: '90%',
        marginTop: 20,
        paddingVertical: 20,
        paddingHorizontal: 25,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "space-between",
    },
    blockVertical: {
        flexDirection: "column",
        borderRadius: 10,
        width: '90%',
        paddingVertical: 20,
        paddingHorizontal: 25,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "space-between",
    },
    blockVerticalThin: {
        flexDirection: "column",
        borderRadius: 10,
        width: '90%',
        paddingVertical: 0,
        paddingHorizontal: 10,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "space-between",
    },
    blockFixedBottom: {
        position: "absolute",
        bottom: 0,
        padding: 20,
        paddingBottom: 60,
        backgroundColor: colors.background,
        width: "100%",
    },
    blockFixedTop: {
        position: "absolute",
        top: 0,
        width: "100%",
    },


    // Text
    title: {
        fontSize: 25,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    primaryText: {
        fontSize: 16,
        color: colors.white,
        fontWeight: "bold",
    },
    text: {
        fontSize: 16,
        color: colors.text,
    },
    disabledText: {
        fontSize: 16,
        color: colors.gray,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#495057',
        alignSelf: 'flex-start',
    },
    
    // button
    ButtonLarge: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    Button: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: colors.secondary,
    },
    darkButton: {
        backgroundColor: colors.dark,
    },

})