import { StyleSheet } from "react-native";

export const colors = {
    primary: "#0D47A1",
    secondary: "#E3F2FD",
    tertiary: "#2196F3",
    background: "#f9f9f9",
    text: "#333",
    textSecondary: "#414040",
    white: "#fff",
    gray: "#EDE9E6",
    lightGray: "#f0f0f0",
    black: "#224248",
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray,
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    blockHorizontal: {
        flexDirection: "row",
        borderRadius: 10,
        width: '90%',
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
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        color: colors.text,
        textAlign: "center",
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 50,
    },
    primaryText: {
        fontSize: 16,
        color: colors.white,
        fontWeight: "bold",
    },
    text: {
        fontSize: 14,
        color: colors.text,
    },
})