import React, { useEffect } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Loading() {
  const positions = [...Array(9)].map(() => ({
    position: new Animated.ValueXY({ x: 0, y: 0 }),
    rotation: new Animated.Value(0),
    color: new Animated.Value(0),
  }));

  // Colors array for transitions
  const colors = [
    "#3B82F6", // blue
    "#10B981", // green
    "#8B5CF6", // purple
    "#F59E0B", // yellow
    "#EF4444", // red
    "#EC4899", // pink
    "#6366F1", // indigo
  ];

  // Define the possible positions in a 3x3 grid
  const gridPositions = [
    { x: -30, y: -30 }, // top-left
    { x: 0, y: -30 }, // top-center
    { x: 30, y: -30 }, // top-right
    { x: -30, y: 0 }, // middle-left
    { x: 0, y: 0 }, // center
    { x: 30, y: 0 }, // middle-right
    { x: -30, y: 30 }, // bottom-left
    { x: 0, y: 30 }, // bottom-center
    { x: 30, y: 30 }, // bottom-right
  ];

  useEffect(() => {
    let currentPositions = [...Array(9)].map((_, i) => i);
    let currentColors = positions.map(() => 0); // Track current color index for each block

    const animate = () => {
      // Create a derangement (permutation where no element stays in place)
      const createDerangement = (n: number) => {
        let derangement;
        do {
          derangement = [...Array(n)].map((_, i) => i);
          for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [derangement[i], derangement[j]] = [derangement[j], derangement[i]];
          }
        } while (derangement.some((val, idx) => val === idx));
        return derangement;
      };

      const newPositions = createDerangement(9);

      // Create animations for each block
      const animations = positions.map((block, index) => {
        const targetPos = gridPositions[newPositions[index]];

        // Reset rotation to 0 before starting new animation
        block.rotation.setValue(0);

        // Choose a new random color different from the current one
        let newColorIndex;
        do {
          newColorIndex = Math.floor(Math.random() * colors.length);
        } while (newColorIndex === currentColors[index]);
        currentColors[index] = newColorIndex;

        return Animated.parallel([
          // Position animation
          Animated.timing(block.position, {
            toValue: targetPos,
            duration: 800,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: false,
          }),
          // Rotation animation
          Animated.sequence([
            Animated.timing(block.rotation, {
              toValue: 180,
              duration: 400,
              easing: Easing.bezier(0.4, 0.0, 0.2, 1),
              useNativeDriver: false,
            }),
            Animated.timing(block.rotation, {
              toValue: 360,
              duration: 400,
              easing: Easing.bezier(0.4, 0.0, 0.2, 1),
              useNativeDriver: false,
            }),
          ]),
          // Color animation
          Animated.timing(block.color, {
            toValue: newColorIndex,
            duration: 800,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
          }),
        ]);
      });

      // Run all animations in parallel
      Animated.parallel(animations).start(() => {
        currentPositions = newPositions;
        // Schedule the next shuffle
        setTimeout(animate, 1200);
      });
    };

    // Start the animation
    animate();

    // Cleanup
    return () => {
      positions.forEach((block) => {
        block.position.stopAnimation();
        block.rotation.stopAnimation();
        block.color.stopAnimation();
      });
    };
  }, []);

  return (
    <View
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          {positions.map((block, index) => (
            <Animated.View
              key={index}
              style={[
                styles.block,
                {
                  transform: [
                    { translateX: block.position.x },
                    { translateY: block.position.y },
                    {
                      rotate: block.rotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                  backgroundColor: block.color.interpolate({
                    inputRange: [...Array(colors.length)].map((_, i) => i),
                    outputRange: colors,
                  }),
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
        <Text style={styles.subText}>
          Please wait while we process your request
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  animationContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  block: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
