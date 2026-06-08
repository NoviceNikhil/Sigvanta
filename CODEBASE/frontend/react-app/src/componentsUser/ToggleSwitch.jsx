import React from 'react';

export default function ToggleSwitch({ checked, onChange }) {
  return (
    <div
      onClick={()=>onChange(!checked)}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer
        ${checked ? 'bg-purple-500' : 'bg-gray-300'}`}
    >
      <div className={`bg-white w-5 h-5 rounded-full shadow transform transition
        ${checked ? 'translate-x-6' : ''}`} />
    </div>
  );
}