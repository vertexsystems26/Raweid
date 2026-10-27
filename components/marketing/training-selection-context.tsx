"use client";

import React, { createContext, useContext, useState } from "react";

type SelectedTraining = { courseId: string; title: string } | null;

type TrainingSelectionContextValue = {
  selectedTraining: SelectedTraining;
  selectTraining: (course: { courseId: string; title: string }) => void;
  clearTraining: () => void;
};

const TrainingSelectionContext = createContext<TrainingSelectionContextValue | null>(null);

export function TrainingSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedTraining, setSelectedTraining] = useState<SelectedTraining>(null);

  return (
    <TrainingSelectionContext.Provider
      value={{
        selectedTraining,
        selectTraining: setSelectedTraining,
        clearTraining: () => setSelectedTraining(null),
      }}
    >
      {children}
    </TrainingSelectionContext.Provider>
  );
}

export function useTrainingSelection() {
  const ctx = useContext(TrainingSelectionContext);
  if (!ctx) {
    throw new Error("useTrainingSelection must be used within a TrainingSelectionProvider");
  }
  return ctx;
}
