import React, { useState } from "react";
import styles from "./detail.module.scss";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import utilsStyles from "../../styles/utils.module.scss";
import { useRouter } from "next/dist/client/router";
import { Formik, Form } from "formik";
import TextField from "../../components/TextField";
import adminComment from "../../FormikValidations/adminComment";
import http from "../../http-config";
import Loader from "../../components/Loader/Loader";
import Head from "next/head";
import Image from "next/image";

function PostDetail({ post, comments }) {
  const Router = useRouter();

  const [showLoader, setShowLoader] = useState(false);

  const addComment = async (values) => {
    const res = await fetch(`${http}/api/admin/comments`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (res.status === 201) {
      setShowLoader(true);
      Router.reload(window.location.pathname);
    } else {
      setShowLoader(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.data.title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.post}>
        <button
          className={utilsStyles.tButton + "  " + styles.back}
          onClick={() => Router.push("/")}
        >
          <MdArrowBack size="32" />
        </button>
        <div className={styles.postDetail}>
          {post.data.postImage &&
            post.data.postImage.length != "" &&
            post.data.postImage != "undefined" && (
              <div className={styles.postImage}>
                <Image
                  src={post.data.postImage}
                  alt={post.data.title}
                  width={1800}
                  height={480}
                  objectFit="cover"
                  priority
                />
              </div>
            )}
          <h3>{post.data.title}</h3>
          <p>{post.data.description}</p>
        </div>
      </div>
      <div className={styles.comments}>
        <h3>All Comments</h3>
        <div className={utilsStyles.hUnderline}></div>
        <div className={styles.allComments}>
          {comments &&
            comments.data
              .filter((comment) => comment.postId === post.data._id)
              .filter((c) => c.active === true)
              .map((c) => (
                <div className={styles.comment} key={c._id}>
                  <h3 className={styles.userComment}>{c.comment}</h3>
                  <div className={styles.user}>
                    <p className={styles.fullName}>{c.fullName}</p>
                    <p className={styles.time}>{c.time.split("T")[0]}</p>
                  </div>
                  {/* <p className={styles.email}>{c.email}</p> */}
                </div>
              ))}
        </div>
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            comment: "",
            postId: post.data._id,
          }}
          validationSchema={adminComment}
          onSubmit={(values) => addComment(values)}
        >
          {(formik) => (
            <Form className={styles.form}>
              <h4>Add Comment</h4>

              <div className={styles.formInputs}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  isInput={true}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="text"
                  isInput={true}
                />
              </div>
              <TextField
                label="Comment"
                name="comment"
                type="text"
                isInput={false}
              />
              {showLoader ? (
                <Loader />
              ) : (
                <button type="submit" className={utilsStyles.tButton}>
                  Add
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(`${http}/api/admin/posts/${context.query.id}`);
  const post = await res.json();

  const resComments = await fetch(`${http}/api/admin/comments`);
  const comments = await resComments.json();

  return {
    props: { post, comments },
  };
}

export default PostDetail;
