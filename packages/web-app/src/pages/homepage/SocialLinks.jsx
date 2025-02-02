import React from 'react';
import styled, { keyframes } from 'styled-components';
import InternationalizedLink from '../../components/common/InternationalizedLink';
import GCLink from '../../components/common/GCLink';
import {
  bloggerLinks,
  wikiBatsLinks,
  facebookLink,
  twitterLink,
  githubLink
} from '../../conf/externalLinks';

const SocialLinksList = styled.ul`
  list-style: none;
  display: inline-block;

  @media (min-width: 550px) {
    margin: 0 5px 0 0;
  }
`;

const SocialLinksListItem = styled.li`
  display: inline-block;
  width: 40px;
  margin: 0 10px;

  @media (min-width: 550px) {
    margin: 0 10px;
  }
`;

const SocialImage = styled.img`
  width: 100%;
  padding: 2px;
  border-radius: 10px;
`;

const rotateAnimation = keyframes`
  {
    45% { transform: rotateY(0deg); }
    50% { transform: rotateY(180deg); }
    55% { transform: rotateY(0deg); }
  }
`;

const ApiSocialImage = styled(SocialImage)`
  animation: ${rotateAnimation} 30s ease-out infinite;
`;

const SocialLinks = () => (
  <SocialLinksList>
    <SocialLinksListItem>
      <InternationalizedLink links={facebookLink}>
        <SocialImage
          src="/images/icons8/icons8-facebook-filled-100.png"
          alt="Follow us on Facebook"
        />
      </InternationalizedLink>
    </SocialLinksListItem>
    <SocialLinksListItem>
      <InternationalizedLink links={bloggerLinks}>
        <SocialImage
          src="/images/icons8/icons8-blogger-filled-100.png"
          alt="Grottocenter blog"
        />
      </InternationalizedLink>
    </SocialLinksListItem>
    <SocialLinksListItem>
      <InternationalizedLink links={twitterLink}>
        <SocialImage
          src="/images/icons8/icons8-twitter-filled-100.png"
          alt="Follow us on Twitter"
        />
      </InternationalizedLink>
    </SocialLinksListItem>
    <SocialLinksListItem>
      <InternationalizedLink links={githubLink}>
        <SocialImage
          src="/images/icons8/icons8-github-filled-100.png"
          alt="Grottocenter3 on GitHub"
        />
      </InternationalizedLink>
    </SocialLinksListItem>
    <SocialLinksListItem>
      <GCLink internal href="/ui/api">
        <ApiSocialImage
          src="/images/icons8/icons8-rest-api-filled-100.png"
          alt="Want to use our API?"
        />
      </GCLink>
    </SocialLinksListItem>
    <SocialLinksListItem>
      <InternationalizedLink links={wikiBatsLinks}>
        <SocialImage src="/images/icons8/bats.svg" alt="Wiki page for bats" />
      </InternationalizedLink>
    </SocialLinksListItem>
  </SocialLinksList>
);

export default SocialLinks;
