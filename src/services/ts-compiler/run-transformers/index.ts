import AbstractRunTransformer from './abstract/AbstractRunTransformer';
import LogTransformer from './LogTransformer';

const transformers: AbstractRunTransformer[] = [ new LogTransformer() ]

export { transformers };