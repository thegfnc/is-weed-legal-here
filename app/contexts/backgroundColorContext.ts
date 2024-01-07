import { Dispatch, SetStateAction, createContext } from 'react'

export enum BackgroundColor {
  YELLOW = 'bg-brand-yellow',
  GREEN = 'bg-brand-green',
  RED = 'bg-brand-red',
}

export const BackgroundColorContext = createContext<BackgroundColor>(
  BackgroundColor.YELLOW
)
export const SetBackgroundColorContext = createContext<
  Dispatch<SetStateAction<BackgroundColor>>
>(() => {})
