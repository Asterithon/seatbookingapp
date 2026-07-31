import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles/global';

interface ShippingSelectorProps {
    selected: string;
    onSelect: (type: string) => void;
}

export default function ServiceSelector({ selected, onSelect }: ShippingSelectorProps) {
    return (
        <View style={styles.container}>        
            <View style={styles.toggleContainer}>

                {/* regular */}
                <TouchableOpacity style={[ styles.toggleButton, selected === 'regular' && styles.activeButton]}
                    onPress={() => onSelect('regular')}
                    activeOpacity={0.8}
                >
                <Text style={[ styles.toggleText, selected === 'regular' && styles.activeText]}>
                    Regular
                </Text>
                </TouchableOpacity>

                {/* express */}
                <TouchableOpacity
                style={[
                    styles.toggleButton,
                    selected === 'express' && styles.activeButton,
                ]}
                onPress={() => onSelect('express')}
                activeOpacity={0.8}
                >
                <Text
                    style={[
                    styles.toggleText,
                    selected === 'express' && styles.activeText,
                    ]}
                >
                    Express
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        padding: 4,
        width: '100%',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeButton: {
        backgroundColor: colors.primary,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    activeText: {
        color: colors.white,
    },
});