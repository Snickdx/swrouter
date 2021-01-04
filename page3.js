const template = document.createElement('template');
template.innerHTML = `
    <style>
    </style>
    <h1>Page 3</h1>
    <p>
    
    </p>
`;

export default class Page3 extends HTMLElement{

    connectedCallback(){
        console.log('component loaded');
    }

    constructor(){
        super();
        this.attachShadow({mode:'open'}).appendChild(template.content.cloneNode(true));
    }
}
