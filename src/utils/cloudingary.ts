import path from "path";

const getCloudinaryPublicId = (imageUrl: string): string => {
  const segments = imageUrl.split("/");
  const fileName = segments[segments.length - 1];
  const folderName = segments[segments.length - 2];
  return folderName + "/" + path.parse(fileName).name;
};

export { getCloudinaryPublicId };
