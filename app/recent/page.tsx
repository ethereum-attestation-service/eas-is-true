"use client";

import React from "react";
import Lottie from "lottie-react";
import tw from "tailwind-styled-components";
import { RecentAttestationsView } from "~~/components/RecentAttestationsView";
import skyAnimation from "~~/public/sky.json";

const Container = tw.div`
  min-h-screen 
  w-full 
  relative 
  overflow-hidden
`;

const AnimationWrapper = tw.div`
  absolute 
  inset-0 
  w-full 
  h-full
`;

const Overlay = tw.div`
  absolute 
  inset-0 
  bg-black 
  bg-opacity-50
`;

const ContentWrapper = tw.div`
  relative 
  z-10 
  min-h-screen 
  w-full 
  flex 
  flex-col 
  items-center 
  p-4
`;

const RecentAttestations = () => {
  return (
    <Container>
      <AnimationWrapper>
        <Lottie
          animationData={skyAnimation}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: "scale(3)",
          }}
        />
      </AnimationWrapper>
      <Overlay />
      <ContentWrapper>
        <RecentAttestationsView />
      </ContentWrapper>
    </Container>
  );
};

export default RecentAttestations;
