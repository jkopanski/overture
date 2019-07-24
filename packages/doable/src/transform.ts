import * as ts from "typescript"

export interface DoableOptions {
}

function transform (ctx: ts.TransformationContext) {
  return (file: ts.SourceFile) => {
    if (file.isDeclarationFile) {
      return file
    }

    return ts.visitEachChild(file, visitor, ctx)
  }

  function visitor (node: ts.Node): ts.VisitResult<ts.Node> {
    switch (node.kind) {
      case ts.SyntaxKind.AwaitExpression:
        return visitAwaitExpression(node as ts.AwaitExpression)

      default:
        return ts.visitEachChild(node, visitor, ctx)
    }
  }

  function visitAwaitExpression (
    node: ts.AwaitExpression
  ): ts.VisitResult<ts.Node> {
    const ident = ts.createUniqueName("await")
    ctx.hoistVariableDeclaration(ident)

    return ts.setOriginalNode(
      ts.setTextRange(
        ident,
        node
      ),
      node
    )
  }
}


export default function (
  program: ts.Program,
  opts: DoableOptions
) {
  return {
    before: transform
  }
}
