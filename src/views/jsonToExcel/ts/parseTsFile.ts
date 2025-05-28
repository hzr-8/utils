import * as ts from 'typescript'; // 需要安装typescript包

async function parseTsFileToJson(file: File) {
  const content = await readFileAsText(file);
  return parseTypeScriptToJson(content, file);
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

function parseTypeScriptToJson(tsCode: string, file: File) {
  // 使用TypeScript编译器API解析代码
  const sourceFile = ts.createSourceFile('temp.ts', tsCode, ts.ScriptTarget.Latest, true);

  // 查找导出的对象
  const exportAssignment = sourceFile.statements.find((st) => ts.isExportAssignment(st));

  if (!exportAssignment) {
    throw new Error('文件没有默认导出' + file.name);
  }

  // 将AST转换为JSON可序列化的对象
  // @ts-ignore
  return convertNodeToJson(exportAssignment.expression);
}

function convertNodeToJson(node: ts.Node) {
  if (ts.isObjectLiteralExpression(node)) {
    const result: Record<string, any> = {};
    node.properties.forEach((prop) => {
      if (ts.isPropertyAssignment(prop)) {
        const key = ts.isIdentifier(prop.name) ? prop.name.text : ts.isStringLiteral(prop.name) ? prop.name.text : prop.name.getText();
        result[key] = convertNodeToJson(prop.initializer);
      }
    });
    return result;
  } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    // 处理普通字符串和没有替换的模板字符串
    return node.text;
  } else if (ts.isTemplateExpression(node)) {
    // 处理带有表达式的模板字符串（如`Hello ${name}`）
    // 这里简化为拼接所有部分
    let result = node.head.text;
    node.templateSpans.forEach((span) => {
      result += convertNodeToJson(span.expression) + span.literal.text;
    });
    return result;
  } else if (ts.isNumericLiteral(node)) {
    return parseFloat(node.text);
  } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  } else if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  } else if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(convertNodeToJson);
  } else if (ts.isIdentifier(node)) {
    // 如果是标识符，尝试获取其文本
    return node.text;
  } else if (ts.isParenthesizedExpression(node)) {
    // 处理括号表达式
    return convertNodeToJson(node.expression);
  }
  throw new Error(`不支持的节点类型: ${ts.SyntaxKind[node.kind]}`);
}

export { parseTsFileToJson };
