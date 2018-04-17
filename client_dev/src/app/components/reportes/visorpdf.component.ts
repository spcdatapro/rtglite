import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-rpt-visor-pdf',
    template: `
    <div class="row">
    <div class= "col-12">
    <object [data]="content" type="application/pdf" style="width: 100%; height: 40em"></object>
    </div>
    </div>`
})
export class VisorPDFComponent {
    @Input() content: any;

    constructor() {}
}
