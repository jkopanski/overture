import * as ts from "typescript"

function typecheck (ctx: ts.TransformationContext) {
  return (file: ts.SourceFile) => {

  }
}

export default function (
  checker: ts.TypeChecker,
  config?: {}
): ts.TransformerFactory<ts.SourceFile> {
  return {
    before: typecheck
  }
}
