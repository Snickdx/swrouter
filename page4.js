const template = document.createElement('template');
template.innerHTML = `
    <style>
    </style>
    <h1>Page 4</h1>
    <p>
    
    </p>
`;

export default class Page4 extends HTMLElement{

    connectedCallback(){
        console.log('component loaded');
    }

    constructor(){
        super();
        this.attachShadow({mode:'open'}).appendChild(template.content.cloneNode(true));
    }
}
