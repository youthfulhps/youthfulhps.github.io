import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';

import * as Dom from '@shared/utils/dom';
import * as Storage from '@shared/utils/storage';
import { THEME } from '@shared/constants';

function getTheme(checked: boolean) {
  return checked ? THEME.DARK : THEME.LIGHT;
}

function toggleTheme(theme: typeof THEME.LIGHT | typeof THEME.DARK) {
  switch (theme) {
    case THEME.LIGHT: {
      Dom.addClassToBody(THEME.LIGHT);
      Dom.removeClassToBody(THEME.DARK);
      break;
    }
    case THEME.DARK: {
      Dom.addClassToBody(THEME.DARK);
      Dom.removeClassToBody(THEME.LIGHT);
      break;
    }
  }
}

function ThemeSwitch() {
  const [checked, setChecked] = useState(true);

  const handleChange = (checked: boolean) => {
    const theme = getTheme(checked);

    Storage.setTheme(checked);
    setChecked(checked);
    toggleTheme(theme);
  };

  useEffect(() => {
    const checked = Storage.getTheme(true);

    handleChange(checked);
  }, []);

  return (
    <div className="text-right">
      <label htmlFor="normal-switch">
        <Switch
          onChange={handleChange}
          checked={checked}
          id="normal-switch"
          height={24}
          width={48}
          checkedIcon={
            <div className="text-center text-[14px] font-black text-[#222]" />
          }
          uncheckedIcon={
            <div className="text-center text-[14px] font-black text-[#222]" />
          }
          offColor={'#d9dfe2'}
          offHandleColor={'#fff'}
          onColor={'#999'}
          onHandleColor={'#282c35'}
        />
      </label>
    </div>
  );
}

export default ThemeSwitch;
