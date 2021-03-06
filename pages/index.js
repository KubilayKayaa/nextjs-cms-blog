import Head from "next/head";
import styles from "../styles/Home.module.scss";
import http from "../http-config";
import Navbar from "../components/client/Navbar/Navbar";
import Posts from "../components/client/Posts/Posts";

function Home({ userInfo, postsInfo }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Homepage</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar userInfo={userInfo} />
      <Posts postsInfo={postsInfo} />
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${http}/api/admin/info`);
  const userInfo = await res.json();

  const postsRes = await fetch(`${http}/api/admin/posts`);
  const postsInfo = await postsRes.json();

  return {
    props: { userInfo, postsInfo },
  };
}

export default Home;
