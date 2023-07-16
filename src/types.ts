export interface EmailFile {
  filename: string;
  ext: string;
}

export interface RPCFunctions {
  list(): EmailFile[];
  getPreview(emailFile: EmailFile): Promise<string>;
  getSourceCode(emailFile: EmailFile): Promise<string>;
}
