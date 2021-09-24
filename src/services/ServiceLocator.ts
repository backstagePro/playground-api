/**
 * Implements ServiceLocator pattern
 */
 export default class ServiceLocator {
  public static services: { [serviceName: string]: any } = {};

  public static lazyLoadedServices: { [serviceName: string]: any } = {};

  /**
   * Register service with given name
   * 
   * @param serviceName 
   * @param service 
   */
  public static set<T>(serviceName: string, service: Function | T, options: {singleton: boolean} = {singleton: true} ): void {
      // adding service in another phase of the application lifecycle

      if (ServiceLocator.services[serviceName] !== void (0)) {
          throw new Error(`Service ${serviceName} is not unique`);
      }

      ServiceLocator.services[serviceName] = { service, options };
  }

  /**
   * Return registered service by name.
   * 
   * @param serviceName - the name of the service. All services begin with `SERVICE_`
   */
  public static async get<T, P = {}>(serviceName: string, params?: P): Promise<T> {

      // if the service is instantiated already, return it
      if (ServiceLocator.lazyLoadedServices[serviceName] !== void (0)) {
          return ServiceLocator.lazyLoadedServices[serviceName];
      }

      if (ServiceLocator.services[serviceName] !== void (0)) {

          // if the service is function and it is not instantiated yet
          if (typeof ServiceLocator.services[serviceName].service === 'function') {
                  
              let service = await ServiceLocator.services[serviceName].service(params);

              if(ServiceLocator.services[serviceName].options.singleton === true){
                  ServiceLocator.lazyLoadedServices[serviceName] = service;
              }

              return service;
          }

          return ServiceLocator.services[serviceName];
      }

      throw new Error("Missing service with name " + serviceName)
  }
}