export type UploaderFunc = (
  file: File,
  progressCallback: (progress: number) => void
) => Promise<string>;
