import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Switch, View } from "react-native";
import "../app/styles/globals.css";
import Loading from "./loading";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      // Reset to visible immediately, then mount component
      fadeAnim.setValue(1);
    } else {
      // Fade out, then unmount
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [loading]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <Switch
          value={loading}
          onValueChange={setLoading}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={loading ? "#f5dd4b" : "#f4f3f4"}
        />
        {loading && (
          <Animated.View
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height - 100,
              backgroundColor: "lightblue",
              opacity: fadeAnim,
            }}
          >
            <Loading />
          </Animated.View>
        )}
      </View>
    </View>
  );
}
