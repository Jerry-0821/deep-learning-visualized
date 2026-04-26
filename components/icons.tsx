type IconProps = {
  className?: string;
};

export function LandingDotIcon({ className }: IconProps) {
  return <div className={["card_icon", "icon_dot", className].filter(Boolean).join(" ")} aria-hidden="true" />;
}

export function LandingGridIcon({ className }: IconProps) {
  return <div className={["card_icon", "icon_grid", className].filter(Boolean).join(" ")} aria-hidden="true" />;
}

export function LandingWaveIcon({ className }: IconProps) {
  return <div className={["card_icon", "icon_wave", className].filter(Boolean).join(" ")} aria-hidden="true" />;
}

export function LandingArrowIcon({ className }: IconProps) {
  return <div className={["card_icon", "icon_arrow", className].filter(Boolean).join(" ")} aria-hidden="true" />;
}

export function TopicIcon({ path }: { path: string }) {
  switch (path) {
    case "m1-neuron":
      return (
        <svg viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="2.7"></circle>
          <line x1="8" y1="1.5" x2="8" y2="4.2"></line>
          <line x1="8" y1="11.8" x2="8" y2="14.5"></line>
          <line x1="1.5" y1="8" x2="4.2" y2="8"></line>
          <line x1="11.8" y1="8" x2="14.5" y2="8"></line>
        </svg>
      );
    case "m1-activation":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M2 12 C4.5 12, 5.2 3.5, 8 3.5 C10.3 3.5, 11.1 8.5, 14 8.5"></path>
          <path d="M2 9 C3.8 9, 4.6 2.5, 8 2.5 C11.4 2.5, 12.2 13.5, 14 13.5" opacity="0.42"></path>
        </svg>
      );
    case "m1-forward":
      return (
        <svg viewBox="0 0 16 16">
          <circle cx="3.5" cy="4" r="1"></circle>
          <circle cx="3.5" cy="8" r="1"></circle>
          <circle cx="3.5" cy="12" r="1"></circle>
          <circle cx="8" cy="6" r="1"></circle>
          <circle cx="8" cy="10" r="1"></circle>
          <circle cx="12.5" cy="8" r="1"></circle>
          <line x1="4.5" y1="4" x2="7" y2="6"></line>
          <line x1="4.5" y1="8" x2="7" y2="6"></line>
          <line x1="4.5" y1="8" x2="7" y2="10"></line>
          <line x1="4.5" y1="12" x2="7" y2="10"></line>
          <line x1="9" y1="6" x2="11.5" y2="8"></line>
          <line x1="9" y1="10" x2="11.5" y2="8"></line>
        </svg>
      );
    case "m1-loss":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M2 12 Q5 4 8 8 T14 5"></path>
          <path d="M2 10.5 L6.2 10.5 L6.2 6.3 L10.2 6.3 L10.2 3.8" opacity="0.48"></path>
        </svg>
      );
    case "m1-backprop":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M14 4 L8 10 L2 4"></path>
          <path d="M14 8.5 L8 14.5 L2 8.5"></path>
        </svg>
      );
    case "m2-gradient":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M2 12 C4.5 8, 6 5, 8.5 5 C10.5 5, 12 6.5, 14 2"></path>
          <circle cx="5.5" cy="8.4" r="1.2"></circle>
          <circle cx="10.2" cy="5.3" r="1.2"></circle>
        </svg>
      );
    case "m2-fit":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M2 12 Q5 5 8 8 T14 4"></path>
          <path d="M2 10 Q5 13 8 10 T14 12"></path>
        </svg>
      );
    case "m2-dropout":
      return (
        <svg viewBox="0 0 16 16">
          <circle cx="4" cy="4" r="1.5"></circle>
          <circle cx="12" cy="4" r="1.5"></circle>
          <circle cx="4" cy="12" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <line x1="5.2" y1="5.2" x2="10.8" y2="10.8"></line>
          <line x1="10.8" y1="5.2" x2="5.2" y2="10.8"></line>
        </svg>
      );
    case "m2-batchnorm":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M3 8 H13"></path>
          <path d="M8 3 V13"></path>
          <circle cx="8" cy="8" r="5"></circle>
        </svg>
      );
    case "m2-adam":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M2 11 C4 9, 5 7, 7 6"></path>
          <path d="M2 13 C4.5 12, 7 9.5, 9 7"></path>
          <path d="M10 6 L12 4"></path>
          <path d="M11 9 L14 9"></path>
        </svg>
      );
    case "m3-split":
      return (
        <svg viewBox="0 0 16 16">
          <rect x="2" y="3" width="3" height="10" rx="1.2"></rect>
          <rect x="6.5" y="5" width="3" height="8" rx="1.2"></rect>
          <rect x="11" y="7" width="3" height="6" rx="1.2"></rect>
        </svg>
      );
    case "m3-bias":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M2 11 C4 7.5, 6 6, 8 6 C10 6, 12 7.2, 14 4"></path>
          <path d="M2 12.5 C4 12.5, 6 2.5, 8 2.5 C10 2.5, 12 13.5, 14 13.5" opacity="0.42"></path>
        </svg>
      );
    case "m3-human":
      return (
        <svg viewBox="0 0 16 16">
          <circle cx="5" cy="4" r="1.3"></circle>
          <path d="M5 5.7 V9.6"></path>
          <path d="M3.3 7.5 H6.7"></path>
          <path d="M4 13 L5 9.6 L6 13"></path>
          <path d="M9 11 H14"></path>
          <path d="M9 8.5 H12.5"></path>
          <path d="M9 6 H11"></path>
        </svg>
      );
    case "m3-mismatch":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M2 11 C4 8, 5.5 7, 7.5 7"></path>
          <path d="M8.5 7 C10.5 7, 12 8, 14 11"></path>
          <path d="M2 13 C4 10, 5.5 9, 7.5 9"></path>
          <path d="M8.5 9 C10.5 9, 12 10, 14 13" opacity="0.42"></path>
        </svg>
      );
    case "m3-transfer":
      return (
        <svg viewBox="0 0 16 16">
          <rect x="2" y="4" width="4" height="4" rx="1"></rect>
          <rect x="10" y="8" width="4" height="4" rx="1"></rect>
          <path d="M6.5 6 H9.5"></path>
          <path d="M8.3 4.8 L9.5 6 L8.3 7.2"></path>
        </svg>
      );
    case "m4-conv":
      return (
        <svg viewBox="0 0 16 16">
          <rect x="2" y="3" width="8" height="8" rx="1.2"></rect>
          <rect x="8" y="7" width="5" height="5" rx="1"></rect>
          <path d="M5 3 V11"></path>
          <path d="M2 6.9 H10"></path>
        </svg>
      );
    case "m4-pooling":
      return (
        <svg viewBox="0 0 16 16">
          <rect x="2" y="2.5" width="5" height="5" rx="1"></rect>
          <rect x="9" y="2.5" width="5" height="5" rx="1"></rect>
          <rect x="5.5" y="9" width="5" height="5" rx="1"></rect>
          <path d="M4.5 7.8 L8 9"></path>
          <path d="M11.5 7.8 L8 9"></path>
        </svg>
      );
    case "m4-featuremap":
      return (
        <svg viewBox="0 0 16 16">
          <rect x="2" y="4" width="5" height="8" rx="1"></rect>
          <rect x="5.5" y="2.5" width="5" height="8" rx="1" opacity="0.6"></rect>
          <rect x="9" y="5" width="5" height="8" rx="1"></rect>
        </svg>
      );
    case "m4-arch":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M3 12 V7"></path>
          <path d="M8 12 V4"></path>
          <path d="M13 12 V2.5"></path>
          <path d="M2 12.5 H14"></path>
        </svg>
      );
    case "m4-transfer":
      return (
        <svg viewBox="0 0 16 16">
          <rect x="2" y="4" width="4.5" height="8" rx="1"></rect>
          <rect x="9.5" y="6" width="4.5" height="4" rx="1"></rect>
          <path d="M6.8 8 H9"></path>
          <path d="M7.8 6.8 L9 8 L7.8 9.2"></path>
        </svg>
      );
    case "m5-rnn":
      return (
        <svg viewBox="0 0 16 16">
          <circle cx="4" cy="8" r="1.6"></circle>
          <circle cx="8" cy="8" r="1.6"></circle>
          <circle cx="12" cy="8" r="1.6"></circle>
          <path d="M5.8 8 H6.2"></path>
          <path d="M9.8 8 H10.2"></path>
          <path d="M8 5.6 C8.9 5.6, 9.6 5, 9.6 4"></path>
        </svg>
      );
    case "m5-vanish":
      return (
        <svg viewBox="0 0 16 16">
          <circle cx="3" cy="8" r="1"></circle>
          <circle cx="7" cy="8" r="1"></circle>
          <circle cx="11" cy="8" r="1"></circle>
          <path d="M4 8 H6" opacity="0.9"></path>
          <path d="M8 8 H10" opacity="0.45"></path>
          <path d="M12 8 H14" opacity="0.2"></path>
        </svg>
      );
    case "m5-lstm":
      return (
        <svg viewBox="0 0 16 16">
          <rect x="5" y="3" width="6" height="10" rx="1.4"></rect>
          <path d="M2 5 H5"></path>
          <path d="M2 8 H5"></path>
          <path d="M2 11 H5"></path>
          <path d="M11 8 H14"></path>
        </svg>
      );
    case "m5-embedding":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M2.5 4.5 H7.5"></path>
          <path d="M2.5 8 H7.5"></path>
          <path d="M2.5 11.5 H7.5"></path>
          <path d="M9.5 4 V12"></path>
          <circle cx="12.5" cy="4.5" r="1"></circle>
          <circle cx="12.5" cy="8" r="1"></circle>
          <circle cx="12.5" cy="11.5" r="1"></circle>
        </svg>
      );
    case "m5-attention":
      return (
        <svg viewBox="0 0 16 16">
          <circle cx="3" cy="8" r="1"></circle>
          <circle cx="8" cy="8" r="1"></circle>
          <circle cx="13" cy="8" r="1"></circle>
          <path d="M4 8 H7"></path>
          <path d="M9 8 H12"></path>
          <path d="M8 8 L13 4"></path>
        </svg>
      );
    default:
      return null;
  }
}
