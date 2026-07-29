import React, { ReactNode } from 'react';
import { Tooltip } from '@chakra-ui/react';

interface MyPopupProps {
  content: string;
  children: ReactNode;
}

function MyPopup({ content, children }: MyPopupProps) {
  return (
    <Tooltip label={content} hasArrow placement="top">
      {children as any}
    </Tooltip>
  );
}

export default MyPopup;
