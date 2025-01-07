import React, { Component } from "react";
import { MenuMenu, MenuItem, Menu } from "semantic-ui-react";

export default class MenuExampleMenus extends Component {
  state = {};

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu>
        <MenuItem
          name="browse"
          active={activeItem === "browse"}
          onClick={this.handleItemClick}
        >
          CrowdCoin
        </MenuItem>

        <MenuMenu position="right">
          <MenuItem
            name="signup"
            active={activeItem === "signup"}
            onClick={this.handleItemClick}
          >
           Campaigns
          </MenuItem>

          <MenuItem
            name="help"
            active={activeItem === "help"}
            onClick={this.handleItemClick}
          >
            +
          </MenuItem>
        </MenuMenu>
      </Menu>
    );
  }
}
