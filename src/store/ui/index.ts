import { create, StateCreator } from 'zustand';

export interface UIState {
}

export const createUI: StateCreator<
  UIState,
  [],
  [],
  UIState
> = (set) => ({
  async addDir2() {
    console.log('2323');
    // let workDir = await open({ multiple: false, directory: true });
    // console.log(workDir);
  }
});
