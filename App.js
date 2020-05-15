import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, SafeAreaView, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "./Spinner";
import {hitScreen, addEventAnalytcis} from "./analytics"
import Constants from "expo-constants"
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  const [isOut, setIsOut] = useState(false);
  const [wvRef, setWVRef] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialUrl = "https://www.tab4u.com/indexForMobile.php";
  const whitelist = ["tab4u.com", "tab4u.co.il"];
  const [url, setUrl] = useState(initialUrl);

  useEffect(()=>{
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Alert.alert("בעית תקשורת! בדוק את החיבור לרשת")
      }
    });
  },[])

  let isExternalUrl = (url) => {
    return (
      whitelist.filter((siteUrl) => url.indexOf(siteUrl) != -1).length == 0
    );
  };

  let goHome = () => {
    addEventAnalytcis("backEvent", url, Constants.deviceId)
    wvRef.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor:"#fbfbfb" }}>
      <Spinner visible={loading} />
      {isOut && (
        <View
          style={{
            backgroundColor: "#ff9800",
            height: 100,
            width: 100,
            position: "absolute",
            bottom: 30,
            right: 30,
            zIndex: 200,
            opacity: 0.9,
            shadowColor: "black",
            shadowOpacity: 0.8,
            shadowRadius: 5,
            shadowOffset: { height: 2, width: 0 },
            borderRadius: 300,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={goHome}
          >
            <Ionicons name="ios-arrow-forward" size={50} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <WebView
        mediaPlaybackRequiresUserAction={true}
        cacheEnabled={true}
        originWhitelist={["*"]}
        ref={(ref) => setWVRef(ref)}
        source={{ uri: url }}
        onLoadStart={(data) => {
          hitScreen(data.nativeEvent.url)
          addEventAnalytcis("userEvent", Constants.deviceId, data.nativeEvent.url)
          addEventAnalytcis("pageEvent", data.nativeEvent.url, Constants.deviceId)
          if (isExternalUrl(data.nativeEvent.url)) {
            addEventAnalytcis("externalUserEvent", Constants.deviceId, data.nativeEvent.url)
            addEventAnalytcis("externalPageEvent", data.nativeEvent.url, Constants.deviceId)
          } else {
            addEventAnalytcis("internalUserEvent", Constants.deviceId, data.nativeEvent.url)
            addEventAnalytcis("internalPageEvent", data.nativeEvent.url, Constants.deviceId)
          }
          // setLoading(true);
        }}
        onLoadEnd={(data) => {
          setLoading(false);
          setIsOut(isExternalUrl(data.nativeEvent.url));
          setUrl(data.nativeEvent.url)
        }}
        style={styles.container}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.99,
  },
});
