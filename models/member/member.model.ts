import { InAuthUser } from "./../in_auth_user";
import FirebaseAdmin from "../firebase_admin";

const MEMBER_COL = "member";
const SCR_NAME_COL = "screen_names";

type AddResult =
  | { result: true; id: string }
  | { result: false }
  | { result: false; message: string };

async function add({
  uid,
  displayName,
  email,
  photoURL,
}: InAuthUser): Promise<AddResult> {
  try {
    const screenName = (email as string).replace("@gamil.com", "");

    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(
      async (transaction) => {
        const memberRef = FirebaseAdmin.getInstance()
          .Firebase.collection("members")
          .doc(uid);

        const screenNameRef = FirebaseAdmin.getInstance()
          .Firebase.collection("screen_names")
          .doc(screenName);
        const memberDoc = await transaction.get(memberRef);
        if (memberDoc.exists) {
          //이미 추가되어진 상태
          return false;
        }

        const addData = {
          uid,
          email,
          displayName: displayName ?? "",
          photoURL: photoURL ?? "",
        };
        await transaction.set(memberRef, addData);
        await transaction.set(screenNameRef, addData);
        return true;
      }
    );
    if (addResult === false) {
      return { result: true, id: uid };
    }
    return { result: true, id: uid };
  } catch (err) {
    console.error(err);
    return { result: false, message: "서버 에러" };
  }
}

const MemberModel = {
  add,
};

export default MemberModel;
