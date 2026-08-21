export function OpenBookIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M60 20 C 46 12, 24 10, 10 16 L10 74 C 24 68, 46 70, 60 78"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 20 C 74 12, 96 10, 110 16 L110 74 C 96 68, 74 70, 60 78"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 20 L60 78"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line x1="18" y1="28" x2="46" y2="24" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="38" x2="44" y2="35" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="48" x2="40" y2="46" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
      <line x1="74" y1="24" x2="102" y2="28" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="35" x2="102" y2="38" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
      <line x1="80" y1="46" x2="102" y2="48" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M52 4 L68 4 L68 40 L60 32 L52 40 Z"
        fill="var(--accent)"
      />
    </svg>
  );
}
