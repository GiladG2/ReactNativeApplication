import React, { useState } from "react";
import Log_In from "./Log_InScreen";// Assuming Log_In is in the same folder
import Sign_Up from "./Sign_UpScreen"; // Assuming Sign_Up is in the same folder
import { View } from "react-native";

export default function App() {
  const [panel, setPanel] = useState("false");

  return (
    <View style={{ flex: 1 }}>
      {panel === "false" ? (
        <Log_In panel={panel} setPanel={setPanel} />
      ) : (
        <Sign_Up panel={panel} setPanel={setPanel}/>
      )}
    </View>
  );
}
