export type HoverArea =
  | {
      kind: "numbers";
      numbers: readonly number[];
    }
  | {
      kind: "row";
      rowIndex: number;
      numbers: readonly number[];
    }
  | {
      kind: "range";
      min: number;
      max: number;
    }
  | {
      kind: "parity";
      parity: "EVEN" | "ODD";
    }
  | {
      kind: "color";
      color: "RED" | "BLACK";
    };

export type HoverHandlers = {
  onBlur: () => void;
  onFocus: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};
