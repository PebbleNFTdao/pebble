import { useQuery } from "./utils";

export const usePath = () => {
  const query = useQuery();
  const code = query.get("code");
  const toPath = code ? `?code=${code}` : "";

  return {
    toPath,
  };
};
