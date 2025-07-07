import axios from "@/services/axios";

/**
 * presigned url 요청
 * @returns string[] presigned url 배열
 */
export async function getPresignedUrls(
  fileNames: string[],
  expirationMinutes = 30,
) {
  const res = await axios.post("/files/presigned-urls", {
    files: fileNames,
    expirationMinutes,
  });
  console.log(res.data);
  // 개선된 응답 구조에 맞게 presigned url 배열만 반환
  return res.data.body.preSignedUrls;
}

/**
 * presigned 업로드 후 S3 url(쿼리 제거) 리스트 반환
 */
export async function uploadFilesAndGetUrls(
  files: File[],
  expirationMinutes = 30,
): Promise<string[]> {
  if (!files.length) return [];
  const presignedUrls: string[] = await getPresignedUrls(
    files.map((f) => f.name),
    expirationMinutes,
  );

  if (!Array.isArray(presignedUrls) || presignedUrls.length !== files.length) {
    throw new Error("Presigned URL 응답이 파일 개수와 일치하지 않습니다.");
  }

  await Promise.all(
    files.map(async (file, idx) => {
      const url = presignedUrls[idx];
      if (!url) throw new Error(`Presigned URL이 없습니다 (index: ${idx})`);
      await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
    }),
  );

  return presignedUrls.map((url) => url.split("?")[0]);
}

/**
 * 최초 파일 그룹 생성 (게시물 하나당 fileId 하나)
 * @returns fileId (Long)
 */
export async function createFileGroup(
  files: File[],
  expirationMinutes = 30,
): Promise<number> {
  const uploadedUrls = await uploadFilesAndGetUrls(files, expirationMinutes);
  console.log(uploadedUrls);
  const res = await axios.post("/files", { fileUrls: uploadedUrls });
  console.log(res.data);
  return res.data.body.fileId; // 반드시 숫자만 반환
}

/**
 * 파일 그룹 수정 (fileId, 전체 fileUrls로 PATCH)
 * @returns fileId (Long)
 */
export async function updateFileGroup(
  fileId: number,
  allFileUrls: string[],
): Promise<number> {
  const res = await axios.patch("/files", { fileId, fileUrls: allFileUrls });
  console.log(res.data);
  return res.data; // fileId (Long)
}