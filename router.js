function registerSW(cb){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async function() {
      const reg = await navigator.serviceWorker.register('/sw.js');
      cb(reg);
    });
  }
}

export default class Router {

  constructor({routes, outlet}, window){

    this.routes = this.loadRoutes(routes);
    this.baseRoute = routes.filter(route=>"base" in route)[0];
    this.current = null;
    
    if(this.baseRoute === undefined)
      throw 'No base route error';

    this.routerOutlet = outlet;
    
    // https://stackoverflow.com/questions/44590393/es6-modules-undefined-onclick-function-after-import
    window.router = this;
    
    window.addEventListener('popstate',  e => this.handleBack(e) );
    
    registerSW((reg)=>{
      this.entryNavigate()
    });
  }

  loadRoutes(routes){
    return routes.reduce(
            (acc, cur)=>{

              acc[cur.url] = cur;
              return acc;

            }, {});
  }

  entryNavigate(){
    if(window.location.pathname in this.routes)
      this.navigate(window.location.pathname);
    else
      this.navigate(this.baseRoute.url);
  }

  getTitle(url){
    const title = `${url}`.replace('/', '');
    const [first, ...rest] = title;
    return first.toUpperCase()+rest.join('');
  }

  async navigate(url){
    const title = this.getTitle(url);
    history.pushState( {title, url}, title, url);
    document.title = title;
    const prev = this.routerOutlet.childNodes[0];
    if(prev)
      this.routerOutlet.removeChild(prev);
      
    this.current = this.routes[url];
    this.routerOutlet.appendChild(this.current);
  }

  handleBack(event){
    if(event.state === null){
      this.navigate(this.homeURL);
    }else{
      this.navigate(event.state.url);  
    }
  }

}