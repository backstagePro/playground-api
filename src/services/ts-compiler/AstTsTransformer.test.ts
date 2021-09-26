import { SERVICE_TRANSFORMER_FACTORY } from "../../services";
import ServiceLocator from "../ServiceLocator";


it('Should test AstTsTransformer', async () => {

  let transformerFactory = await ServiceLocator.get<SERVICE_TRANSFORMER_FACTORY>(SERVICE_TRANSFORMER_FACTORY);
  let loggerTransformer = transformerFactory.getTransformer('logger', {filePath: '/home/niki/bs/playground-api/src/services/ts-compiler/Test.ts'});

  console.log('t', loggerTransformer.addLogs());

  
  expect(true).toBe(true);
})