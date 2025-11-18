import React from 'react';

// Este layout simplemente renderiza sus hijos, heredando el layout padre.
export default function AutosLayout({ children }) {
  return (
    <>{children}</>
  );
}