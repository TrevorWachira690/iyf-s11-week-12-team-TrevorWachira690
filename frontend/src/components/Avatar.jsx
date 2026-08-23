export default function Avatar({ src, name, size = 36 }) {
  const style = { width: size, height: size, fontSize: size * 0.42 };

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s avatar` : 'avatar'}
        className="avatar-img"
        style={style}
      />
    );
  }

  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  return (
    <div className="avatar-fallback" style={style}>
      {initial}
    </div>
  );
}
