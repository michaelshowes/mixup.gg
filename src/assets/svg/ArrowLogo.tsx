type Props = {
  arrowColor?: string;
  color?: string;
  size?: number;
  strokeColor?: string | undefined;
  stroke?: boolean;
  className?: string;
};

export default function ArrowLogo({
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
      viewBox='0 0 401.2 401.1'
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      vectorEffect={'non-scaling-stroke'}
      className={className}
    >
      <path
        fill={color}
        vectorEffect={'non-scaling-stroke'}
        stroke={stroke ? strokeColor : 'none'}
        d='M401.2,264.8l-65.3-65.3-201.6,201.6L0,266.7,201.6,65.1,136.4,0h264.8v264.8'
      />
    </svg>
  );
}
