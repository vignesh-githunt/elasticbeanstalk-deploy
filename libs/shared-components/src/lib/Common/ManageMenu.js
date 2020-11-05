import React from 'react';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

export const ManageMenu = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ButtonDropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <DropdownToggle caret color="secondary">
        Manage
      </DropdownToggle>
      <DropdownMenu>
        {menuItems.map((menuItem) => {
          return menuItem.href ? (
            <DropdownItem key={menuItem.href} href={menuItem.href}>
              {menuItem.text}
            </DropdownItem>
          ) : (
            <DropdownItem key={menuItem.text} onClick={menuItem.onClick}>
              {menuItem.text}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </ButtonDropdown>
  );
};
