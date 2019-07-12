/**
 * Data type with exactly single inhabitant.
 * An alias for TypeScript void.
 * This assumes `strict` flag enabled,
 * as otherwise it would be passible
 * to assign `null` to it as well.
 */
export type Unit = void

export const unit: Unit = void 0
