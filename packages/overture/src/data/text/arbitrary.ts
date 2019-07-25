import { Arbitrary, string } from "fast-check"

export default function (): Arbitrary<string> {
  return string()
}
