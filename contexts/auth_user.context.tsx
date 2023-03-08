import React, { createContext, useContext } from "react";
import useFirebaseAuth from "../hooks/use_firebase_auth";
import { InAuthUser } from "../models/in_auth_user";

interface InAuthUserContext {
  authUser: InAuthUser | null;
  /** 로그인 여부가 진행중인지 체크 */
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthUserContext = createContext<InAuthUserContext>({
  authUser: null,
  loading: true,
  signInWithGoogle: async () => ({ user: null, credential: null }),
  signOut: () => {},
});

export const AuthUserProvider = function ({
  children,
}: {
  //ReactNode 타입은 jsx 내에서 사용할 수 있는 모든 요소의 타입을 의미, 즉 string, null, undefined 등을 포함하는 가장 넓은 범위를 갖는 타입
  children: React.ReactNode;
}) {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthUserContext);
