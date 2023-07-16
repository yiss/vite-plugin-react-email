import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

import { File } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { createRPCClient } from "vite-dev-rpc";
import { createHotContext } from "vite-hot-client";
import { EmailFile, RPCFunctions } from "../types";
import "highlight.js/styles/github.css";
import hljs from "highlight.js";


// const emailFiles = [
//   {
//     filename: "linear-login-code",
//     ext: "ll",
//   },

//   {
//     filename: "lorem-google-code",
//     ext: "ll",
//   },
//   {
//     filename: "chacha-not-here-code",
//     ext: "ll",
//   },
// ];

const rpc = createRPCClient<RPCFunctions>(
  "vite-plugin-react-email",
  (await createHotContext(
    "/___",
    `${location.pathname.split("/__email-preview__")[0] || ""}/`.replace(
      /\/\//g,
      "/"
    )
  ))!
);

function App() {
  const [emailFiles, setEmailFiles] = useState<EmailFile[]>([]);
  const [current, setCurrent] = useState<EmailFile>();
  const [currentSource, setCurrentSource] = useState("");
  const [currentPreview, setCurrentPreview] = useState("");

  useEffect(() => {
    hljs.highlightAll();
  });

  useEffect(() => {
    async function listEmails() {
      const res = await rpc.list();
      setEmailFiles(res);
    }
    listEmails();
  }, []);

  useEffect(() => {
    async function getEmailPreviewAndSource() {
      console.log(current);

      try {
        const source = await rpc.getSourceCode(current!);
        const preview = await rpc.getPreview(current!);
        setCurrentSource(source);
        setCurrentPreview(preview);
        console.log({
          source,
          preview,
        });
      } catch (err) {
        console.log(err);
      }
    }
    if (current) {
      getEmailPreviewAndSource();
    }
  }, [current]);

  const onClickEmailName = async (emailFile: EmailFile) => {
    setCurrent(emailFile);
    // if (emailFile) {
    //   const res = await rpc.getPreview(emailFile.filename);
    //   console.log(res);

    // }
  };

  return (
    <div className="flex">
      <aside className="h-screen border-r border-slate-200 flex flex-col w-60 pt-6 px-2 space-y-2">
        {emailFiles.map((emailFile) => {
          return (
            <button
              className="flex items-center p-1 space-x-2 hover:bg-gray-200 hover:rounded"
              type="button"
              key={emailFile.filename}
              onClick={() => onClickEmailName(emailFile)}
            >
              <File strokeWidth={1.5} size={18} />
              <span className="text-sm">{emailFile.filename}</span>
            </button>
          );
        })}
      </aside>
      <div className="flex-1 mx-auto h-full mt-2">
        <Tabs defaultValue="source" className="h-full">
          <TabsList className="flex justify-center mx-auto w-fit">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="source">Source</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="h-screen">
            <iframe
              srcDoc={currentPreview}
              className="border-none w-full h-full"
            ></iframe>
          </TabsContent>
          <TabsContent value="source" className="max-h-screen overflow-hidden">
            <div className="container mx-auto">
              <pre>
                <code className="language-typescript text-xs">
                  {currentSource}
                </code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
