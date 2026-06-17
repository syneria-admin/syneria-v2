import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ConfigState {
  file: File | null;
  modelSpecs: { volume: number; triangles: number; name: string } | null;
  options: {
    process: 'fdm' | 'sla' | 'sls';
    materialId: string;
    finishId: string;
    color: string;
    infill: number;
  };
  setFile: (file: File | null) => void;
  setSpecs: (specs: any) => void;
  updateOptions: (options: Partial<ConfigState['options']>) => void;
  reset: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      file: null,
      modelSpecs: null,
      options: {
        process: 'fdm',
        materialId: '',
        finishId: 'std',
        color: '',
        infill: 15,
      },
      setFile: (file) => set({ file }),
      setSpecs: (modelSpecs) => set({ modelSpecs }),
      updateOptions: (newOptions) => 
        set((state) => ({ options: { ...state.options, ...newOptions } })),
      reset: () => set({ file: null, modelSpecs: null }),
    }),
    {
      name: 'syneria-config-storage',
      storage: createJSONStorage(() => sessionStorage), // Persiste durant la session
      partialize: (state) => ({ options: state.options, modelSpecs: state.modelSpecs }), 
    }
  )
);