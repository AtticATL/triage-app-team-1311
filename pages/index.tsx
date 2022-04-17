import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>TransferApp</title>
        <meta
          name="description"
          content="Fast and accurate patient transfers"
        />
      </Head>
      <main>
        <h1>yay! it works</h1>
        <div>{"we've put some things in a div"}</div>
      </main>
    </div>
  );
}
