import React from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Burger, Center, Container, Group, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { textDecoration } from "@chakra-ui/react";

/* const links = [
  { link: "/about", label: "Features" },
  {
    link: "#1",
    label: "Learn",
    links: [
      { link: "/docs", label: "Documentation" },
      { link: "/resources", label: "Resources" },
      { link: "/community", label: "Community" },
      { link: "/blog", label: "Blog" },
    ],
  },
  { link: "/about", label: "About" },
  { link: "/pricing", label: "Pricing" },
  {
    link: "#2",
    label: "Support",
    links: [
      { link: "/faq", label: "FAQ" },
      { link: "/demo", label: "Book a demo" },
      { link: "/forums", label: "Forums" },
    ],
  },
]; */

const HeaderMenu = ({ logo, links }) => {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              href={link.link}
              style={{
                display: "block",
                lineHeight: 1,
                padding: "8px 12px",
                borderRadius: 15,
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 500,
              }}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span style={{ marginRight: "5px" }}>{link.label}</span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        style={{
          display: "block",
          lineHeight: 1,
          padding: "8px 12px",
          borderRadius: 15,
          textDecoration: "none",
          fontSize: 12,
          fontWeight: 500,
        }}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header
      style={{
        height: "56px",
        marginBottom: "120px",
        //backgroundColor:,
        borderBottom: "1px solid teal",
      }}
    >
      <Container size="md">
        <div
          style={{
            height: "56px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <MantineLogo size={28} /> */}
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
};

export default HeaderMenu;
