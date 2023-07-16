import { Plugin } from "vite";
import { render } from "@react-email/render";
import esbuild from "esbuild";
import jiti from "jiti";

import fs from "fs";
import path from "path";
import { createRPCServer } from "vite-dev-rpc";
import { remove } from "fs-extra";

import { DIR_CLIENT } from "../dir";
import { EmailFile, RPCFunctions } from "../types";
import sirv from "sirv";

export interface Options {
  emailsDir?: string;
}

export default function PluginReactEmail(options: Options): Plugin {
  const { emailsDir = "emails" } = options;
  const emailPluginCacheDir = path.resolve(process.cwd(), "__email-preview__");
  const emailDirFullPath = path.resolve(process.cwd(), emailsDir);

  async function cleanCacheDir() {
    if (fs.existsSync(emailPluginCacheDir)) {
      await remove(emailPluginCacheDir);
    }
  }

  function createCacheDirectory() {
    if (!fs.existsSync(emailPluginCacheDir)) {
      fs.mkdirSync(emailPluginCacheDir);
    }
  }

  function transpileReactEmail(emailFile: EmailFile) {
    const { filename, ext } = emailFile;
    console.log({ emailFile });
    console.log({
      path: path.resolve(emailDirFullPath, `${filename}.${ext}`),
    });

    esbuild.buildSync({
      entryPoints: [path.resolve(emailDirFullPath, `${filename}.${ext}`)],
      format: "esm",
      outfile: path.resolve(emailPluginCacheDir, `${filename}.js`),
      // external: ['@react-email/components'],
    });
  }

  function list(): EmailFile[] {
    return fs.readdirSync(emailDirFullPath).map((file) => {
      const ext = path.extname(file).replace(".", "");

      const filename = file.replace(path.extname(file), "");
      console.log({ file, filename });

      return {
        filename,
        ext,
      };
    });
  }

  async function getPreview(emailFile: EmailFile) {
    try {
      transpileReactEmail(emailFile);
      const loader = jiti(undefined as unknown as string, {
        interopDefault: true,
        esmResolve: true,
      });
      const email = loader(
        loader.resolve(
          path.resolve(emailPluginCacheDir, `${emailFile.filename}.js`)
        )
      );

      interface EmailComponent {
        PreviewProps: Record<string, unknown>;
      }

      const { PreviewProps } = email as EmailComponent;
      const html = render(email(PreviewProps));

      return html;
    } catch (err) {
      console.log(err);
    }
  }

  async function getSourceCode(emailFile: EmailFile) {
    const { filename, ext } = emailFile;
    console.log({
      debug: path.resolve(emailDirFullPath, `${filename}.${ext}`),
    });

    return fs.readFileSync(
      path.resolve(emailDirFullPath, `${filename}.${ext}`),
      "utf-8"
    );
  }

  function init() {
    cleanCacheDir();
    createCacheDirectory();
    list().forEach((emailFile) => transpileReactEmail(emailFile));
  }

  init();

  return {
    name: "vite-plugin-react-email",
    configureServer(server) {
      console.log(DIR_CLIENT);

      server.middlewares.use(
        "/__email-preview__",
        sirv(DIR_CLIENT, {
          single: true,
          dev: true,
        })
      );
      const rpcFunctions = {
        list,
        getPreview,
        getSourceCode,
      };

      createRPCServer<RPCFunctions>(
        "vite-plugin-react-email",
        server.ws,
        rpcFunctions
      );
    },
  };
}
