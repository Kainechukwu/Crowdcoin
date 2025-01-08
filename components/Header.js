import React, { Component } from "react";
import { MenuMenu, MenuItem, Menu } from "semantic-ui-react";
import { withRouter } from "next/router";

class MenuExampleMenus extends Component {
  state = {
    activeItem: "crowdcoin",
  };

  componentDidMount() {
    // Set active item based on the current route
    const { pathname } = this.props.router;
    this.setState({ activeItem: pathname });
  }

  links = [
    { route: "/", title: "Campaigns", label: "Campaigns" },
    { route: "/campaigns/new", title: "Create Campaign", label: "+" },
  ];

  handleItemClick = (e, { name, route }) => {
    const { router } = this.props;

    // Update active item and navigate to the route
    this.setState({ activeItem: name });
    router.push(route);
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Menu>
        <MenuItem
          name="crowdcoin"
          route='/'
          active={activeItem === "crowdcoin"}
          onClick={this.handleItemClick}
        >
          CrowdCoin
        </MenuItem>

        <MenuMenu position="right">
          {this.links.map(({ route, title, label }) => (
            <MenuItem
              key={route}
              route={route}
              name={title}
              active={activeItem === route}
              onClick={this.handleItemClick}
            >
              {label}
            </MenuItem>
          ))}
        </MenuMenu>
        
      </Menu>
    );
  }
}
export default withRouter(MenuExampleMenus);
