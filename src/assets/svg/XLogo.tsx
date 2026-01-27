type Props = {
  arrowColor?: string;
  color?: string;
  size?: number;
  strokeColor?: string | undefined;
  stroke?: boolean;
  className?: string;
};

export default function XLogo({
  arrowColor,
  color,
  size = 10,
  strokeColor = '#000',
  stroke = false,
  className
}: Props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      id='Layer_1'
      version='1.1'
      viewBox='0 0 671.9 671.9'
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      vectorEffect={'non-scaling-stroke'}
      className={className}
    >
      <path
        d='m401.2 535.6-65.3-65.3-201.6 201.6L0 537.5l201.6-201.6-65.2-65.1h264.8v264.8'
        fill={arrowColor ? arrowColor : color}
      />
      <path
        d='m537.5 0 134.4 134.4L470.3 336l201.6 201.6L537.5 672l-76.8-76.8V211.1h-384L0 134.4 134.4 0 336 201.6 537.5 0'
        fill={color ? color : 'none'}
        stroke={stroke ? strokeColor : 'none'}
        vectorEffect={'non-scaling-stroke'}
      />
    </svg>
  );
}
