# 1. 로그인 기능 구현 (Email, Google, GitHub)

<br/><br/>

## - 홈페이지 (Email 로그인)

<br/>

##### 홈페이지 첫 화면에서 아래와 같이 useEffect를 사용하여 현재 로그인 여부를 판별한다. 만약 로그인이 되어 있다면 현재 로그인 된 계정의 이메일을 화면에 보여주고 그렇지 않다면 auth페이지로 넘어가 회원가입 또는 로그인을 하도록 설정 하였다.

<br/>

```typescript
useEffect(() => {
  onAuthStateChanged(authService, (user) => {
    if (user) {
      if (user.email !== null) setCurrentUserEmail(user.email);
      return;
    }
    router.push("/auth");
  });
}, []);

return <span>환영합니다!! {currentUserEmail}님!</span>;
```

<br/>

## - auth 페이지

<br/>

##### auth 페이지에는 Email과 Password를 입력하는 두 input이 있고, 로그인 회원가입 버튼이 있다. 처음 auth 페이지가 랜더링 되면 로그인 버튼에는 Log In이 쓰여있고, 회원 가입을 클릭할 시 isNewAccount가 true가 되면서 해당 버튼에 Create Account가 쓰여지게 된다.

<br/>

```typescript
return (
  <>
    <input type="text" placeholder="Email" />
    <input type="password" placeholder="Password" />
    <input
      type="submit"
      value={isNewAccount ? "Create Account" : "Log in"}
      onSubmit={handleSubmit}
    />
    <button
      onClick={() => {
        setIsNewAccount(true);
      }}
    >
      회원 가입
    </button>
  </>
);
```

<br/>

##### Email과 Password를 다 입력한 후 Submit이벤트가 발생하게 되면 아래의 handleSubmit 함수가 실행된다.

<br/>

```typescript
const handleSubmit: React.FormEventHandler<HTMLFromElement> = (event) => {
  event.preventDefault();
  if (isNewAccount === true) {
    createUserWithEamilAndPassword(authService, Email, Password).then(
      (response) => {
        if ((response.operationType = "signIn")) {
          signOut(authService);
          setIsNewAccount(false);
          alert(
            "회원가입에 성공 하셨습니다! 회원가입하신 정보로 로그인 바랍니다."
          );
          setEmail("");
          setPassword("");
        }
      }
    );
    return;
  }
  signInWithEmailAndPassword(authService, Email, Password).then((response) => {
    if (response.operationType === "signIn") {
      router.push("/");
    }
  });
};
```

<br/>

##### 위 함수는 다음의 2가지의 역할을 수행한다.

##### 1. isNewAccount가 참이라면 (회원가입 버튼을 클릭했다면) firebase의 `createUserWithEmailAndPassword(Auth, Email, Password)`함수를 사용하여 회원 가입을 진행하고, 회원 가입이 정상적으로 완료 되면 회원가입 된 정보를 통해 로그인을 진행하도록 한다.

##### 2. isNewAccount가 거짓이라면 (회원가입 버튼을 클릭하지 않았다면) firebase의 `signInWithEmailAndPassword(Auth, Email, Password)`함수를 사용하여 로그인을 진행하고, 로그인이 성공적으로 완료 되면 홈페이지로 이동시킨다.

<br/>
<br/>

##### +위 함수에서 사용되는 `router`는 Next.js의 `useRouter`를 사용한 것이다. `router.push('link')`를 사용하면 link로 이동하게 된다.

```typescript
import { useRouter } from "next/router";

const router = useRouter();
```

<br/>

##### +위 함수에서 사용되는 `authService`는 firebase의 `getAuth`함수를 사용한 것이다.

```typescript
const FireBasApp = initializeApp(firebaseConfig);
export const authService = getAuth(FireBasApp);
```

<br/>

---

## - Google, GitHub 로그인

<br/>

##### firebase에서 제공하는 google, github 로그인 방식은 매우 간단하다. `GithubAuthProvider`, `GoogleAuthProvider` 이 두 객체를 생성하고 `signInWithPopup(Auth, provider)`함수를 사용하면 쉽게 googe, github 로그인을 구현할 수 있다.

```typescript
const handleGoogleAuth = () => {
  const googleProvider = new GoogleAuthProvider();
  signInWithPopup(authService, googleProvider).then((response) => {
    if (response.operationType === "signIn") {
      router.push("/");
    }
  });
};

const handleGitHubAuth = () => {
  const githubProvider = new GithubAuthProvider();
  signInWithPopup(authService, githubProvider).then((response) => {
    if (response.operationType === "signIn") {
      router.push("/");
    }
  });
};

return (
  <>
    <button onClick={handleGoogleAuth}>Continue with Google</button>
    <button onClick={handleGitHubAuth}>Continue with GitHub</button>
  </>
);
```

##### google 로그인, github 로그인 버튼을 클릭하였을 때 각각 `handleGoogleAuth`, `handleGitHubAuth` 함수가 실행되는데 해당 함수가 호출되면 함수 내에서 `GithubAuthProvider`, `GoogleAuthProvider`를 사용하여 새로운 provider를 생성하고 이를 `signInWithPopup(Auth, provider)`함수의 인자로 전달한 후 로그인이 성공되면 홈페이지로 이동하는 방식으로 로그인을 구현하였다.

<br/>
<br/>

# 2. 이미지 업로드, 삭제 및 랜더링 기능 구현 (storage, firestore)

<br/><br/>

## - 이미지 업로드 기능 (storage)

<br/>

##### 이미지 업로드 기능을 구현하기 위해 firebase의 storage를 이용하였다. `<input type="file" accept="image/*" />`을 이용하여 이미지 파일을 입력 받았다. 입력받은 이미지 파일을 `firebase/storage`의 `uploadBytes` 함수를 사용해 storage에 `images/${userId}/${imageTitle}`의 경로에 저장하는 방식으로 이미지 업로드 기능을 구현하였다. 이때 이미지의 다운로드 url을 firestore에 저장하는 코드를 동시에 수행하여 추후에 이미지들을 랜더링 할 때 storage의 `listAll`함수를 사용하지 않고, firestore에 있는 url정보를 이용해 쉽게 이미지를 생성해낼 수 있도록 하였다.

<br/>

```typescript
const [imageFile, setImageFile] = useState<File>();
const [imageTitle, setImageTitle] = useState<string>("");
const imageUploadRef = useRef<HTMLInputElement>(null);
const [imageUrlToFirestore, setImageUrlToFirestore] = useState<string>("");

const handleImageSelect: React.ChangeEventHandler<HTMLInputElement> = (
  event
) => {
  if (event.target.files !== null) {
    setImageFile(event.target.files[0]);
  }
};
const handleImageTitle: React.ChangeEventHandler<HTMLInputElement> = (
  event
) => {
  setImageTitle(event.target.value);
};

const handleImageSubmit: React.MouseEventHandler<HTMLButtonElement> = () => {
  const imageSubmitRef = ref(storageService, `images/${userId}/${imageTitle}`);
  if (imageFile !== undefined)
    uploadBytes(imageSubmitRef, imageFile).then(() => {
      getDownloadURL(imageSubmitRef).then((response) => {
        setImageUrlToFirestore(response);
      });
    });
  if (imageUploadRef.current !== null) {
    imageUploadRef.current.value = "";
  }
};

const uploadImageUrlListToFirestore = async (url: string, title: string) => {
  const imageUrlListRef = doc(DBService, "userData", userId);
  await updateDoc(imageUrlListRef, {
    images: arrayUnion({ image: url, imageTitle: title }),
  });
};

useEffect(() => {
  if (imageUrlToFirestore == "") return;
  uploadImageUrlListToFirestore(imageUrlToFirestore, imageTitle);
  setImageTitle("");
  setImagePreviewSrc("");
}, [imageUrlToFirestore]);

return (
  <>
    <input
      type={"text"}
      onChange={handleImageTitle}
      value={imageTitle}
      placeholder="이미지 제목?"
    />
    <input
      type={"file"}
      onChange={handleImageSelect}
      accept="image/*"
      ref={imageUploadRef}
    />
    <button onClick={handleImageSubmit}>이미지 업로드</button>
  </>
);
```

<br/>

##### 이미지 파일이 선택될 때마다 `imageFile` state를 해당 파일로 변경 시키고, 이미지 업로드 버튼을 클릭할 시 `images/${userId}/${imageTitle}`의 경로로 이미지 파일을 업로드 시킨다. 이때 storage의 `getDownloadURL`함수를 사용하여 해당 파일의 다운로드 링크를 받아와 그 값과 이미지 제목으로 입력받은 문자열을 `{ image: url, imageTitle: tilte }`의 형식으로 업로드 시킨다.

<br/>

## - 이미지 삭제 기능 (storage, firestore)

<br/>

##### 랜더링 된 이미지를 삭제하기 위해선 화면에 보여지고 있는 firestore의 이미지 url을 삭제하여야 하고, 해당 이미지와 같은 이미지를 storage에서도 삭제해야 한다. firestore의 이미지 url을 삭제하기 위해서 `updateDoc`와 `arrayRemove`함수를 사용하였고, storage에 있는 이미지 파일을 삭제하기 위해서 `deleteObject`함수를 사용하였다.

<br/>

```typescript
const handleDeleteImage = async (url: string, title: string) => {
  const storageImageRef = ref(storageService, `images/${userId}/${title}`);
  const firestoreImageRef = doc(DBService, "userData", `${userId}`);

  await deleteObject(storageImageRef)
    .then((response) => console.log(response))
    .catch((error) => console.log(error));

  await updateDoc(firestoreImageRef, {
    images: arrayRemove({ image: url, imageTitle: title }),
  });
};
```

<br/>

## - 이미지 랜더링 기능 (firestore)

<br/>

##### 이미지 랜더링 기능을 구현하기 위해 처음 사용했던 방법은 storage의 참조를 만들고 해당 참조에 해당하는 이미지 파일들을 `listAll`함수를 이용하여 불러오는 방식이었다. 하지만 이 방법은 코드가 너무 복잡하여 포기했다.. 대신 firestore에 `userData/userId/images`에 url과 title을 저장한 내용을 불러와 해당 내용을 list type의 state로 불러와 `map()`함수로 랜더링 하는 방식을 사용했다.

<br/>

```typescript
const [userData, setUserData] = useState<DocumentData>();
const [imageData, setImageData] = useState<
  { image: string; imageTitle: string }[]
>([]);

useEffect(() => {
  const userDataRef = doc(DBService, "userData", `${userId}`);
  onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
    setUserData(doc.data());
  });
}, []);
useEffect(() => {
  if (userData !== undefined) setImageData(userData.images);
}, [userData]);

return (
  <Style.FlexBox>
    {imageData !== undefined &&
      imageData.map((data, index) => {
        return (
          <Style.ImageCard key={index}>
            <Style.ProfilePageImage src={data.image} />
            <span>{data.imageTitle}</span>
          </Style.ImageCard>
        );
      })}
  </Style.FlexBox>
);
```
