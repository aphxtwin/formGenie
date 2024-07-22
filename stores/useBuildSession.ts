import {create} from 'zustand'

interface BuildSesionState {
    buildSessionId: string | null
    setBuildSessionId: (id: string) => void
  }

export const useBuildSessionStore = create<BuildSesionState>((set) => ({
    buildSessionId: null,
    setBuildSessionId: (id:string)=>set({buildSessionId:id})

}))