import Navbar from "../../components/admin/Navbar/Navbar";
import { Formik, Form } from "formik";
import TextField from "../../components/TextField";
import adminUserInfo from "../../FormikValidations/adminUserInfo";
import styles from "./admin-user-info.module.scss";
import utilsStyles from "../../styles/utils.module.scss";
import http from "../../http-config";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import Head from "next/head";
import Redirect from "../../components/Redirect";

function Index({ userInfo }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuth(sessionStorage.getItem("user") ? true : false);
    setIsLoading(false);
  }, [isAuth]);

  const updateUserInfo = async (values) => {
    const get = await fetch(`${http}/api/admin/info`);
    const getData = await get.json();

    if (userInfo.data.length !== 0) {
      const res = await fetch(`${http}/api/admin/info/${getData.data[0]._id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (res.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 1000);
      }
    } else {
      const res = await fetch(`${http}/api/admin/info`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (res.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 1000);
      }
    }
  };

  if (isLoading) {
    return null;
  } else {
    if (isAuth == true) {
      return (
        <div>
          <Head>
            <title>Admin User Info</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <div className={styles.container}>
            <Formik
              initialValues={{
                fullName:
                  userInfo && userInfo.data.length !== 0
                    ? userInfo.data[0].fullName
                    : "",
                title:
                  userInfo && userInfo.data.length !== 0
                    ? userInfo.data[0].title
                    : "",
                instagram:
                  userInfo && userInfo.data.length !== 0
                    ? userInfo.data[0].instagram
                    : "",
                twitter:
                  userInfo && userInfo.data.length !== 0
                    ? userInfo.data[0].twitter
                    : "",
                github:
                  userInfo && userInfo.data.length !== 0
                    ? userInfo.data[0].github
                    : "",
              }}
              validationSchema={adminUserInfo}
              onSubmit={(values) => updateUserInfo(values)}
            >
              {(formik) => (
                <Form className={styles.form}>
                  <h3>User Info</h3>
                  <div className={utilsStyles.hUnderline}></div>

                  <TextField
                    label="Full Name"
                    name="fullName"
                    type="text"
                    isInput={true}
                  />
                  <TextField
                    label="Title"
                    name="title"
                    type="text"
                    isInput={true}
                  />
                  <TextField
                    label="Instagram"
                    name="instagram"
                    type="text"
                    isInput={true}
                  />
                  <TextField
                    label="Twitter"
                    name="twitter"
                    type="text"
                    isInput={true}
                  />
                  <TextField
                    label="Github"
                    name="github"
                    type="text"
                    isInput={true}
                  />
                  {isSuccess ? (
                    <div className={styles.loader}>
                      <Loader />
                    </div>
                  ) : (
                    <button type="submit" className={utilsStyles.tButton}>
                      {userInfo && userInfo.data.length !== 0
                        ? "Update User Info"
                        : "Create User Info"}
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/admin/auth/signin" />;
    }
  }
}

export async function getServerSideProps(context) {
  const res = await fetch(`${http}/api/admin/info`);
  const userInfo = await res.json();

  return {
    props: { userInfo },
  };
}
export default Index;
