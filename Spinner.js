import React from "react"
import Spinner from "react-native-loading-spinner-overlay";

let SpinnerWrapper = props => {
  return <Spinner visible={props.visible} textContent={""} animation="fade" textStyle={{}} />;
};

export default SpinnerWrapper;
