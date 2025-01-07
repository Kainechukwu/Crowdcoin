import React from "react";
import Head from 'next/head';

export default function StyleSheet() {
  return (
    <Head>
      <link
        async
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
      />
      {/* <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
      <link rel="stylesheet" type="text/css" href="/dist/semantic.min.css" /> */}
      <script src="/dist/semantic.min.js"></script>
    </Head>
  );
}
