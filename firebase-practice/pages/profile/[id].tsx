import Layout from "components/layout"
import { GetServerSideProps } from "next"

export default function ProfilePage({ userId }: Props) {
  return <Layout>{userId}</Layout>
}

type Props = {
  userId: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const userId = context.params?.id as string
  return {
    props: {
      userId,
    },
  }
}
