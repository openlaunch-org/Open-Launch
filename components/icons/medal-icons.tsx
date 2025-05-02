interface MedalProps {
  className?: string;
}

export function GoldMedal({ className = "w-4 h-4" }: MedalProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <polygon
          fill="#3b82f6"
          points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3"
        />
        <circle fill="#1d4ed8" cx="60" cy="46.4" r="32.2" />
        <circle fill="#1e40af" cx="60" cy="46.4" r="25.3" />
        <path
          fill="#FFFFFF"
          d="M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z"
        />
      </g>
    </svg>
  );
}

export function SilverMedal({ className = "w-4 h-4" }: MedalProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <polygon
          fill="#3b82f6"
          points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3"
        />
        <circle fill="#1d4ed8" cx="60" cy="46.4" r="32.2" />
        <circle fill="#1e40af" cx="60" cy="46.4" r="25.3" />
        <text
          x="60"
          y="50"
          fontFamily="Arial, sans-serif"
          fontSize="36"
          fontWeight="bold"
          fill="#FFFFFF"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          2
        </text>
      </g>
    </svg>
  );
}

export function BronzeMedal({ className = "w-4 h-4" }: MedalProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <polygon
          fill="#3b82f6"
          points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3"
        />
        <circle fill="#1d4ed8" cx="60" cy="46.4" r="32.2" />
        <circle fill="#1e40af" cx="60" cy="46.4" r="25.3" />
        <text
          x="60"
          y="50"
          fontFamily="Arial, sans-serif"
          fontSize="36"
          fontWeight="bold"
          fill="#FFFFFF"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          3
        </text>
      </g>
    </svg>
  );
}
