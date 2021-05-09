function NovoNivel() {
    console.log('novo nível');
    level.AddLevel();
}

async function FecharNivel() {
    console.log('inicio FecharNivel()');
    await level.CloseLevel();
    console.log('fim FecharNivel()');
}

async function FecharTudo() {
    while (level.listLevels.length > 0)
        await FecharNivel();
}

//-----------------------------------------------------------------------------//

class Level {
    listLevels = new Array<JQuery<HTMLElement>>();
    
    constructor() {
        window.addEventListener('popstate', (ev: PopStateEvent) => { this.OnPopState(ev); });
    }
    
    AddLevel() : void {
        let newHash: string = window.location.href.replace(window.location.hash || '', '') + "#" + (this.listLevels.length + 1).toString();
        history.pushState({ tabIndex: this.listLevels.length + 1}, null, newHash);
        let level = $(`<div>${this.listLevels.length + 1}</div>`);
        this.listLevels.push(level);
        level.appendTo("body");
    }
    
    private promisseResolve: any;

    CloseLevel() : Promise<void> {
        return new Promise((resolve) : void => {
            console.log('inicio corpo promise');
            this.promisseResolve = resolve;
            if (this.listLevels.length > 0)
                history.back();
            else
                this.promisseResolve();
            console.log('fim corpo promise');
        });
    }
    
    OnPopState(popState: PopStateEvent) {
        if (popState.state !== null) {
            
            if (popState.state.tabIndex < this.listLevels.length) {
                this.RemoveLevel();
            } else if (popState.state.tabIndex > this.listLevels.length) {
                console.log("NÃO É PERMITODO AVANÇAR");
                history.back();
            }
        } else
        {
            if (this.listLevels.length > 0)
                this.RemoveLevel();
        }
    }
    
    RemoveLevel() : void {
        console.log('inicio RemoveLevel()');
        let level = this.listLevels.pop();
        level.remove();
        this.promisseResolve();
        console.log('fim RemoveLevel()');
    }

}

let level = new Level();