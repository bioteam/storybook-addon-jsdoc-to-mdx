import { formatJsDocComment, removeCommentsFromCode } from "./utils";
import type { JsDocComment } from "./types/common";

export function createMdxContent(jsDocComments: JsDocComment[], pathName: string): string {
  let mdxContent = `import { Meta } from '@storybook/blocks';\n\n<Meta title="${pathName}" />\n\n`;

  jsDocComments.forEach((comment: JsDocComment) => {
    if (comment.name != "Unnamed") {
      mdxContent += `## ${comment.name} <code class="type-decl">${comment.type}</code>\n`;
    } else {
      mdxContent += `## \n`;
    }

    if (comment.parentName) {
      mdxContent += `**Parent**: \`${comment.parentName}\`\n\n`;
    }
        
    mdxContent += formatJsDocComment(comment.comment) + "\n\n";
    if (comment.code) {
      mdxContent += `#### Code:\n\n`;
      mdxContent += "```ts\n" + removeCommentsFromCode(comment.code) + "\n```\n\n";
    }
  });

  return mdxContent;
}
