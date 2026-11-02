import React from 'react';

export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.375a.375.375 0 01.375.375v.375a.375.375 0 01-.375.375h-.375A.375.375 0 0118.375 11.25v-.375a.375.375 0 01.375-.375zM16.5 15.375a.375.375 0 01.375-.375h.375a.375.375 0 01.375.375v.375a.375.375 0 01-.375.375h-.375a.375.375 0 01-.375-.375v-.375z"
    />
  </svg>
);