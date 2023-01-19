import { NextPage } from "next";
import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import { useAuth } from "../contexts/auth_user.context";
import { ServiceLayout } from "../components/service_layout";
import { GoogleLoginButton } from "../components/google_login_button";

const IndexPage: NextPage = function () {
  const { signInWithGoogle, authUser } = useAuth();
  console.info(authUser);
  return (
    <ServiceLayout title="test">
      <Box maxW="md" mx="auto" pt="10">
        <img src="/main_logo.svg" alt="메인 로고" />
        <Flex justify="center">
          <Heading>#BlahBlah</Heading>
        </Flex>
      </Box>
      <Center mt="20">
        <GoogleLoginButton
          onClick={() => {
            signInWithGoogle();
            console.log("click");
          }}
        />
      </Center>
    </ServiceLayout>
  );
};

export default IndexPage;
