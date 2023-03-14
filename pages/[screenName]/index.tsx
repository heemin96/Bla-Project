import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { ServiceLayout } from "./../../components/service_layout";
import ResizeTextarea from "react-textarea-autosize";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth_user.context";
import { InAuthUser } from "../../models/in_auth_user";
import axios, { AxiosResponse } from "axios";
import MessageItem from "../../components/message_item";
import { InMessage } from "../../models/member/in_message";

interface Props {
  userInfo: InAuthUser | null;
}

async function postMessage({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    phtoURL?: string;
  };
}) {
  if (message.length <= 0) {
    return {
      result: false,
      message: "메세지를 입력해주세요",
    };
  }
  try {
    await fetch("/api/messages.add", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        uid,
        message,
        author,
      }),
    });
    return {
      result: true,
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      message: "메세지 등록 실패",
    };
  }
}

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  const [message, setMessage] = useState("");
  const [isAnonymous, setAnonymous] = useState(true);
  const toast = useToast();
  const { authUser } = useAuth();
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  const [messageListFetchTrigger, setMessageListFetchTrigger] = useState(false);

  async function fetchMessageList(uid: string) {
    try {
      const resp = await fetch(`/api/messages.list?uid=${uid}`);

      if (resp.status === 200) {
        const data = await resp.json();
        setMessageList(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMessageInfo({
    uid,
    messageId,
  }: {
    uid: string;
    messageId: String;
  }) {
    try {
      const resp = await fetch(
        `/api/messages.info?uid=${uid}&messageId=${messageId}`
      );

      if (resp.status === 200) {
        const data: InMessage = await resp.json();
        setMessageList((prev) => {
          const findIndex = prev.findIndex((fv) => fv.id === data.id);
          if (findIndex > 0) {
            const updateArr = [...prev];
            updateArr[findIndex] = data;
            return updateArr;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (userInfo === null) return;
    fetchMessageList(userInfo.uid);
  }, [userInfo]);

  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  return (
    <ServiceLayout
      title={`${userInfo.displayName}의 home`}
      minH="100vh"
      backgroundColor="gray.50"
    >
      <Box maxW="md" mx="auto" pt="6">
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          mb="2"
          bg="white"
        >
          <Flex>
            <Avatar
              size="lg"
              src={userInfo.photoURL ?? "https://bit.ly/broken-link"}
              margin="3"
              marginRight="5"
            />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          mb="2"
          bg="white"
        >
          <Flex align="center" p="2">
            <Avatar
              size="xs"
              src={
                isAnonymous
                  ? "https://bit.ly/broken-link"
                  : authUser?.photoURL ?? "https://bit.ly/broken-link"
              }
              mr="2"
            />
            <Textarea
              bg="gray.100"
              border="none"
              placeholder="무엇이 궁금한가요?"
              resize="none"
              minH="unset"
              overflow="hidden"
              fontSize="xs"
              mr="2"
              as={ResizeTextarea}
              maxRows={7}
              value={message}
              onChange={(e) => {
                // 최대 7줄만 스크린샷에 표현되니 7줄 넘게 입력하면 제한걸어야한다.
                if (e.target.value) {
                  const lineCount =
                    (e.target.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1) + 1;
                  if (lineCount > 7) {
                    toast({
                      title: "최대 7줄까지만 입력가능합니다",
                      position: "top-right",
                    });
                    return;
                  }
                }
                setMessage(e.currentTarget.value);
              }}
            />
            <Button
              disabled={message.length === 0}
              bgColor="black"
              color="white"
              colorScheme="blue"
              variant="solid"
              size="sm"
              onClick={async () => {
                const author = isAnonymous
                  ? undefined
                  : {
                      displayName: authUser?.displayName ?? "",
                      photoURL: authUser?.photoURL,
                    };
                const postData: {
                  message: string;
                  uid: string;
                  author?: {
                    displayName: string;
                    photoURL?: string;
                  };
                } = {
                  message,
                  uid: userInfo.uid,
                };
                if (isAnonymous === false) {
                  postData.author = {
                    photoURL:
                      authUser?.photoURL ?? "https://bit.ly/broken-link",
                    displayName: authUser?.displayName ?? "anonymous",
                  };
                }
                const messageResp = await postMessage(postData);
                if (messageResp.result === false) {
                  toast({ title: "메세지 등록 실패", position: "top-left" });
                }
                setMessage("");
                setMessageListFetchTrigger((prev) => !prev);
              }}
            >
              등록
            </Button>
          </Flex>
          <FormControl display="flex" alignItems="center" mt="1" mx="2" pb="2">
            <Switch
              size="sm"
              colorScheme="orange"
              id="anonymous"
              mr="1"
              isChecked={isAnonymous}
              onChange={() => {
                if (authUser === null) {
                  toast({
                    title: "로그인이 필요합니다",
                    position: "top-left",
                  });
                  return;
                }
                setAnonymous((prev) => !prev);
              }}
            />
            <FormLabel htmlFor="anonymous" mb="0" fontSize="xx-small">
              Anonymous
            </FormLabel>
          </FormControl>
        </Box>
        <VStack spacing="12px" mt="6">
          {messageList.map((messageData) => (
            <MessageItem
              key={`message-item-${userInfo.uid}-${messageData.id}`}
              item={messageData}
              uid={userInfo.uid}
              displayName={userInfo.displayName ?? ""}
              photoURL={userInfo.photoURL ?? "https://bit.ly/broken-link"}
              isOwner={authUser !== null && authUser.uid === userInfo.uid}
              onSendComplete={() => {
                fetchMessageInfo({
                  uid: userInfo.uid,
                  messageId: messageData.id,
                });
              }}
            />
          ))}
        </VStack>
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { screenName } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
  try {
    const protocol = process.env.PROTOCOL || "http";
    const host = process.env.HOST || "localhost";
    const port = process.env.PORT || "3000";
    const baseUrl = `${protocol}://${host}:${port}`;

    //서버 사이드이기 때문에 그냥 /로 하면 어디로 보내야 할지 모른다. 그러기 때문에 baseurl 필요함
    const userInfoResp: AxiosResponse<InAuthUser> = await axios(
      `${baseUrl}/api/user.info/${screenName}`
    );
    console.info(userInfoResp.data);
    return {
      props: {
        userInfo: userInfoResp.data ?? null,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        userInfo: null,
      },
    };
  }
};

export default UserHomePage;
