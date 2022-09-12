import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

export interface IHomeProps {}

const Home: NextPage = (props: IHomeProps) => {
  return (
    <React.Fragment>
      <Head>
        <title>Lumerie</title>
      </Head>
      <div className='w-screen h-screen flex justify-center items-center'>
        <h1 className='text-5xl font-bold'>Hello world</h1>
      </div>
    </React.Fragment>
  );
};

export default Home;
