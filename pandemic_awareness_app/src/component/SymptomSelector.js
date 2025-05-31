import React from "react";
import RNPickerSelect from "react-native-picker-select";

export default function SymptomSelector({ symptoms, onAddSymptom }) {
  return (
    <RNPickerSelect
      onValueChange={onAddSymptom}
      items={symptoms.map((symptom) => ({
        label: symptom.name,
        value: symptom.id,
      }))}
      placeholder={{ label: "Select a symptom...", value: null }}
    />
  );
}
