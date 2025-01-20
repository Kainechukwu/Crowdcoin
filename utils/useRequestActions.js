import { useRouter } from "next/router";

export const useRequestActions = () => {
  const router = useRouter();
  const { address } = router.query;

  const approve = async (index) => {
    console.log("approve", index);
  };
  const finalize = async (index) => {
    console.log("finalize", index);
  };

  return {
    approve,
    finalize,
  };
};
