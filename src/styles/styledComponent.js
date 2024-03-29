import styled, { css } from 'styled-components';

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

export const FileUploadContainer = styled.div`
  width: 100%;
  padding: 0 1em;
  .overflow-hidden {
    display: -webkit-box;
    max-width: 300px;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .name-file {
    max-width: 300px;
    display: block;
    background: transparent;
    border-color: rgb(65, 71, 155);
    border-width: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .size-file {
    color: lightgrey;
    display: block;
  }
  .container-btns {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-around;
  }
`;

export const Button = styled.button`
  display: block;
  text-align: center;
  border-radius: 5px;
  border: 1px solid transparent;
  color: white;
  padding: 10px;
  cursor: pointer;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  ${(props) =>
    props.disabled &&
    css`
      background: grey;
    `};
`;

export const InputFile = styled.input`
  text-align: center;
  border-radius: 5px;
  border: 1px solid transparent;
  background: #41479b;
  color: white;
  padding: 10px;
  cursor: pointer;
  ${(props) =>
    props.cancel &&
    css`
      background: transparent;
      color: #41479b;
      border-color: #41479b;
    `};
`;

export const ErrorMessage = styled.div`
  background: rgb(255, 0, 0, 0.3);
  color: red;
  border-radius: 5px;
  padding: 10px;
  margin: 20px 0 30px;
`;
