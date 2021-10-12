import AbstractRunTransformer from './abstract/AbstractRunTransformer';
import LogTransformer from './LogTransformer';
import ImportTransform from './ImportTransform';

const transformers: AbstractRunTransformer[] = [ new LogTransformer(), new ImportTransform() ]

export { transformers };