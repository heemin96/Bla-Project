import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { ServiceLayout } from "./../../components/service_layout";

const userInfo = {
  uid: "test",
  email: "rlagmlalsrjt69@gmail.com",
  displayName: "heemin kim",
  photoUrl:
    "https://lh3.googleusercontent.com/a/AGNmyxaFJrfz7u0i_Em3hH8dlW7FS3zqYZtMxXgEl_A-MQ=s96-c",
};

const UserHomePage: NextPage = function () {
  return (
    <ServiceLayout title="user home" minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="6">
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          mb="2"
          bg="white"
        >
          <Flex>
            <Avatar size="lg" src={userInfo.photoUrl} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </ServiceLayout>
  );
};

export default UserHomePage;
