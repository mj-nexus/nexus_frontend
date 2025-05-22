import React from "react";

export default function ProfileMini({ user }) {
  const img_uri = user?.Profile?.img_uri;
  const nick_name = user?.Profile?.nick_name;
  const name = user?.Profile?.user_name;
  // 이니셜 추출
  const initials = (nick_name || name || 'U').slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{
        width: 55, height: 55, borderRadius: '50%', background: '#e0e7ef',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#2563eb', overflow: 'hidden'
      }}>
        {img_uri ? (
          <img src={img_uri} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <h3 style={{ fontWeight: 600, fontSize: 18, color: '#222' }}>{nick_name}</h3>
        <p style={{ fontWeight: 500, fontSize: 13, color: '#b1b1b1' }}>{name}</p>
      </div>
    </div>
  );
}