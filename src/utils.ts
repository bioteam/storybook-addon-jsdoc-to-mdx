import path from "path";
import ts from "typescript";
import jsdoc from "jsdoc-api";

export function removeCommentsFromCode(code: string): string {
  const printer = ts.createPrinter({ removeComments: true });
  const sourceFile = ts.createSourceFile("temp.ts", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  return printer.printFile(sourceFile);
}

export function findBasePath(filePath: string, folderPaths: string[]): string {
  for (const folderPath of folderPaths) {
    if (filePath.startsWith(folderPath)) {
      return folderPath;
    }
  }
  return "";
}

export function getPathName(filePath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, filePath);
  const dirName = path.dirname(relativePath);
  const extenstion = path.extname(filePath);
  const baseName = path.basename(relativePath, extenstion);

  /*
  if (baseName === "index") {
    return dirName.replace(/\\/g, "/");
    }
    */

  return path.join(dirName, baseName).replace(/\\/g, "/");
}

export function formatJsDocComment(comment: string): string {
  let formatted = "```\n" + comment + "\n```\n"; // fallback

  const parsed = jsdoc.explainSync({
    source: `${comment}\nconst x = y;\n`
  });
  if (parsed.length === 2) {
    const parsedComment = parsed[0];
    formatted = "";
    //formatted = "```\n" + JSON.stringify(parsedComment, undefined, 2) + "\n```\n\n";
    if (parsedComment.description) {
      formatted += `${parsedComment.description}\n`;
    }
    if (parsedComment.params && parsedComment.params.length > 0) {
      let paramTable = "<table>\n";
      paramTable += "<thead><tr><th>Name</th><th>Type</th><th>Description</th><th>Optional</th></tr></thead>\n";
      for (const param of parsedComment.params) {
        paramTable += "<tr>";
        paramTable += `<td>${param.name}</td>`;
        paramTable += `<td>\`${JSON.stringify(param.type)}\`</td>`;
        paramTable += `<td>${param.description}</td>`;
        paramTable += `<td>${param.optional || ""}</td>`;
        paramTable += "</tr>\n";
      }
      paramTable += "</table>\n";
      formatted += "\n" + paramTable;
    }
  }
  
  return formatted;
}
