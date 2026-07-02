export const sidebarNavHoverClass =
  "group/sidebar-nav relative isolate overflow-hidden border border-(--color-surface-icon) transition-[translate,color,border-color,box-shadow,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[linear-gradient(90deg,rgb(200_40_49_/_22%)_0%,rgb(32_38_56_/_86%)_58%,rgb(250_204_21_/_10%)_100%)] before:opacity-0 before:transition-opacity before:duration-500 after:absolute after:inset-y-2 after:left-0 after:w-0.5 after:rounded-r-full after:bg-(--color-brand) after:opacity-0 after:shadow-[0_0_16px_rgb(200_40_49_/_70%)] after:transition-opacity after:duration-500 hover:translate-x-px hover:border-(--color-brand) hover:text-white hover:shadow-[0_10px_26px_rgb(0_0_0_/_24%),0_0_16px_rgb(200_40_49_/_18%)] hover:before:opacity-100 hover:after:opacity-100";

export const sidebarNavIconHoverClass =
  "transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/sidebar-nav:scale-110 group-hover/sidebar-nav:brightness-125";

export const sidebarGameNavHoverClass =
  "group/sidebar-game relative isolate overflow-hidden border border-transparent transition-[color,border-color,box-shadow,background-color] duration-300 before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_20%_50%,rgb(200_40_49_/_20%)_0%,rgb(27_33_49_/_78%)_44%,transparent_100%)] before:opacity-0 before:transition-opacity before:duration-300 after:absolute after:inset-y-3 after:left-4 after:w-1 after:rounded-full after:bg-(--color-brand) after:opacity-0 after:shadow-[0_0_14px_rgb(200_40_49_/_70%)] after:transition-opacity after:duration-300 hover:border-(--color-border-control) hover:bg-(--color-surface-nav-hover) hover:text-white hover:shadow-[inset_0_1px_0_rgb(255_255_255_/_5%),0_8px_18px_rgb(0_0_0_/_18%)] hover:before:opacity-100 hover:after:opacity-100";

export const sidebarGameNavIconHoverClass =
  "transition duration-300 group-hover/sidebar-game:scale-105 group-hover/sidebar-game:brightness-125";
