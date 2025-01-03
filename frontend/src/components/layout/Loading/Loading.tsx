import "./Loading.css";

interface Props {
  bg?: string;
  className?: string;
}

export default function Loading(props: Props) {
  return (
    <div
      className={`loader ${props.className}`}
      style={{
        background: `radial-gradient(farthest-side, ${props.bg} 94%, #0000) top/8px
      8px no-repeat,
    conic-gradient(#0000 30%, ${props.bg})`,
      }}
    ></div>
  );
}
