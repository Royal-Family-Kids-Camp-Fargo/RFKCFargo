import React from 'react';
import useStore from '../../zustand/store';

function LogOutButton(props) {

  const logout = useStore(store => store.logout)

  return (
    <button
      // This button shows up in multiple locations and is styled differently
      // because it's styled differently depending on where it is used, the className
      // is passed to it from it's parents through React props
      className={props.className}
      onClick={logout}
    >
      Log Out
    </button>
  );
}

export default LogOutButton;
