import { ButtonState } from "@/components/ui/games/WordButton";

export interface WordButtonType {
  text: string;
  type?: string;
  drawType?: boolean;
  state?: ButtonState;
}