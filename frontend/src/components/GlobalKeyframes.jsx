import React from "react";

export default function GlobalKeyframes() {
  return (
    <style>{`
      @keyframes fadeIn { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:translateY(0);} }
      @keyframes toastIn { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:translateY(0);} }
      @keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 5px rgb(219 234 254);} 50% { box-shadow: 0 0 0 9px rgb(219 234 254);} }
    `}</style>
  );
}
