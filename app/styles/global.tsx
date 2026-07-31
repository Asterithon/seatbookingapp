import { StyleSheet } from "react-native";

export const colors = {
    primary: "#073477",
    secondary: "#2196F3",
    tertiary: "#E3F2FD",
    background: "#f9f9f9",
    ground: "#dee5ef",
    text: "#333",
    textSecondary: "#414040",
    white: "#fff",
    gray: "#cdcdcd",
    lightGray: "#f0f0f0",
    black: "#224248",
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
        fontSize: 20,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        color: colors.text,
        textAlign: "center",
        marginBottom: 20,
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
    
    // button
    ButtonLarge: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    Button: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 50,
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: colors.secondary,
    },

    // card
      card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },

})