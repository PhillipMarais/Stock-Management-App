/** The API sends images as bare base64; browsers detect the actual format from the bytes. */
export function imageSrc(base64: string): string {
  return `data:image/jpeg;base64,${base64}`;
}
