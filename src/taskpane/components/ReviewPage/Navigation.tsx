import React from 'react';
import { Nav } from '@fluentui/react';

const Navigation = () => {
  const links = [
    {
      links: [
        { name: 'Home', url: '/', key: 'home' },
        { name: 'information', url: '/information', key: 'information' },
      ],
    },
  ];

  return (
    <Nav
      groups={links}
      selectedKey="home"
      styles={{
        root: {
          width: 200,
          height: '100%',
          boxSizing: 'border-box',
          border: '1px solid #eee',
        },
      }}
    />
  );
};

export default Navigation;
