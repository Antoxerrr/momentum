export default function UserAvatar({ className, username, sizeClassName }) {
  const sizeClass = sizeClassName || 'w-9 h-9 text-sm';

  if (!username) {
    return (
      <div
        className={`${className || ''} ${sizeClass} rounded-full bg-default-200`}
      />
    );
  }

  const color = getColorByUsername(username);

  return (
    <div
      className={`${className || ''} ${sizeClass} text-white rounded-full flex items-center justify-center`}
      style={{
        background: color,
      }}
    >
      <span>{getInitials(username)}</span>
    </div>
  );
}

function getInitials(username) {
  const words = username.split(' ');
  let initials;

  if (words.length == 1) {
    initials = words[0].slice(0, 2);
  } else {
    initials = [words[0][0], words[1][0]].join('');
  }

  return initials.toUpperCase();
}

function getColorByUsername(username) {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8C471',
    '#82E0AA',
  ];

  let hash = 0;

  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;

  return colors[index];
}
