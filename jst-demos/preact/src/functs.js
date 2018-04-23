//module.exports = { clickevent: () => {debugger; alert(JSON.stringify(this.props))} }



export default class Functions  {
    constructor(ref) {
        this['props'] = ref.props || ref.attributes;
        this['context'] = ref.context;
        this['idx'] = 0;
    }

    clickevent() {
        this['idx'] = this['idx'] + 2; 

        alert(this.idx);
        alert(JSON.stringify(this.props)); 
    }


}
