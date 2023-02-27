import styled from 'styled-components';

export const InChatNotification = styled.aside`
  border-top: 2px solid #dddddd;
  border-bottom: 2px solid #dddddd;
  width: 80%;
  margin: 0 auto 1.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: grey;
  & .icon {
    margin: 0.5em auto 0em;
  }
`;

export const RowInteraction = styled.div`
  width: 85%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 20px 10px !important;
`;

export const BubbleContainer = styled.div`
  max-width: 100%;
  height: 100%;
  padding: 0.8em 1em;

  display: flex;
  flex-direction: column;
  margin-right: auto;

  color: rgba(0, 0, 0, 0.87);
  border-radius: 0px 15px 15px;
  background-color: rgb(237, 241, 245);
`;

export const AvatarContainer = styled.div``;
