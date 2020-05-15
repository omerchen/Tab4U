import React, { useEffect } from "react";
import { Analytics, PageHit, Event } from "expo-analytics";

const IS_DEBUG = false
const GOOGLE_ANALYTICS_DEBUG = false

export let googleAnalyticsObject = new Analytics("UA-166764753-1", null, {
  debug: GOOGLE_ANALYTICS_DEBUG,
});

export const hitScreen = (routeName) => {
  googleAnalyticsObject
    .hit(new PageHit(routeName))
    .then(
      () =>
        GOOGLE_ANALYTICS_DEBUG &&
        console.log("hit " + routeName + " successfully!")
    )
    .catch((e) => {
      if (GOOGLE_ANALYTICS_DEBUG) {
        console.log("hit " + routeName + " FAILED:");
        console.log(e);
      }
    });
};

export const addEventAnalytcis = (category, action, label, value) => {
  let realCategory = IS_DEBUG ? category + "/DEBUG" : category;
  googleAnalyticsObject
    .event(new Event(realCategory, action, label, value))
    .then(
      () =>
        GOOGLE_ANALYTICS_DEBUG &&
        console.log(
          "event " +
            realCategory +
            "-" +
            action +
            "-" +
            label +
            " was added successfully successfully!"
        )
    )
    .catch((e) => {
      if (GOOGLE_ANALYTICS_DEBUG) {
        console.log(
          "event " + category + "-" + action + "-" + label + " FAILED:"
        );
        console.log(e);
      }
    });
};

export const updateStoreInCity = (city, storeId, userId) => {
  addEventAnalytcis("updateStoreCityUserUnique", city, userId);
  addEventAnalytcis("updateStoreCityStoreUniqer", city, storeId);
};

export const getStoreInCity = (city, storeId, userId) => {
  addEventAnalytcis("getStoreCityUserUnique", city, userId);
  addEventAnalytcis("getStoreCityStoreUniqer", city, storeId);
};

export let Tracker = (props) => {
  useEffect(() => {
    if (IS_DEBUG) {
      hitScreen(props.navigation.state.routeName + "/DEBUG");
    } else {
      hitScreen(props.navigation.state.routeName);
    }
  }, []);

  return null;
};
