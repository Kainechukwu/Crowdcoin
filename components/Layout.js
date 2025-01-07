import React from "react";
import Header from "./Header";
import StyleSheet from "./StyleSheet";
import { Container } from "semantic-ui-react";

export default function Layout({ children }) {
  return (
    <Container className="mt-10">
      <StyleSheet />
      <Header />
      {children}
    </Container>
  );
}
