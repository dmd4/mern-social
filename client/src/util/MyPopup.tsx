import { Popup } from 'semantic-ui-react';
import React, { ReactNode } from 'react';

interface MyPopupProps {
  content: string;
  children: ReactNode;
}

function MyPopup({ content, children }: MyPopupProps) {
  return <Popup inverted content={content} trigger={children as any} />;
}

export default MyPopup;
