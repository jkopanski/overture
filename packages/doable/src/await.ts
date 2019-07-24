import * as ts from "typescript"

export function visitAwaitExpression (
  node: ts.AwaitExpression
): ts.Expression {
  const ident = ts.createUniqueName("await")

  return ts.setOriginalNode(
    ts.setTextRange(
      ident,
      node
    ),
    node
  )
}

export function getParentBlock () {
}

export function getBindingVariable () {
}

export default function visitor (node: ts.Node): ts.Node {
  if(ts.isExpressionStatement(node)) {
    const child = node.expression
    if(ts.isAwaitExpression(child)) {
      return ts.createExpressionStatement(ts.createCall(
        ts.createPropertyAccess(
          child.expression,
          ts.createIdentifier("bind")
        ),
        undefined, // typeArguments
        [] // argumentsArray
      ))
    }
  }
}
