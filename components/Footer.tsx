import React from "react";
import Link from "next/link";
import tw from "tailwind-styled-components";
import { hardhat } from "viem/chains";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const FooterContainer = tw.div`
  min-h-0 
  py-5 
  px-1 
  mb-11 
  lg:mb-0
`;

const FixedBottomBar = tw.div`
  fixed 
  flex 
  justify-between 
  items-center 
  w-full 
  z-10 
  p-4 
  bottom-0 
  left-0 
  pointer-events-none
`;

const LeftSection = tw.div`
  flex 
  flex-col 
  md:flex-row 
  gap-2 
  pointer-events-auto
`;

const ExplorerLink = tw(Link)`
  btn 
  btn-primary 
  btn-sm 
  font-normal 
  gap-1
`;

const FooterContent = tw.div`
  w-full
`;

const FooterMenu = tw.ul`
  menu 
  menu-horizontal 
  w-full
`;

const FooterLinks = tw.div`
  flex 
  justify-center 
  items-center 
  gap-2 
  text-sm 
  w-full
`;

// const LinkItem = tw.div`
//   text-center
// `;
//
// const ExternalLink = tw.a`
//   link
// `;
//
// const BuidlGuidlLink = tw.a`
//   flex
//   justify-center
//   items-center
//   gap-1
// `;

export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <FooterContainer>
      <div>
        <FixedBottomBar>
          <LeftSection>
            {isLocalNetwork && (
              <>
                <Faucet />
                <ExplorerLink href="/blockexplorer" passHref>
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </ExplorerLink>
              </>
            )}
          </LeftSection>
        </FixedBottomBar>
      </div>
      <FooterContent>
        <FooterMenu>
          <FooterLinks>
            {/*<LinkItem>*/}
            {/*  <ExternalLink href="https://github.com/scaffold-eth/se-2" target="_blank" rel="noreferrer">*/}
            {/*    Fork me*/}
            {/*  </ExternalLink>*/}
            {/*</LinkItem>*/}
            {/*<span>·</span>*/}
            {/*<div className="flex justify-center items-center gap-2">*/}
            {/*  <p className="m-0 text-center">*/}
            {/*    Built with <HeartIcon className="inline-block h-4 w-4" /> at*/}
            {/*  </p>*/}
            {/*  <BuidlGuidlLink href="https://buidlguidl.com/" target="_blank" rel="noreferrer">*/}
            {/*    <BuidlGuidlLogo className="w-3 h-5 pb-1" />*/}
            {/*    <span className="link">BuidlGuidl</span>*/}
            {/*  </BuidlGuidlLink>*/}
            {/*</div>*/}
            {/*<span>·</span>*/}
            {/*<LinkItem>*/}
            {/*  <ExternalLink href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA" target="_blank" rel="noreferrer">*/}
            {/*    Support*/}
            {/*  </ExternalLink>*/}
            {/*</LinkItem>*/}
          </FooterLinks>
        </FooterMenu>
      </FooterContent>
    </FooterContainer>
  );
};
