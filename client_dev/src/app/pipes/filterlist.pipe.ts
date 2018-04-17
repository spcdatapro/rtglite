import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterList',
    pure: false
})
export class FilterListPipe implements PipeTransform {
    transform(items: any[], campo: String, filter: String): any {
        if (!items || !filter) { return items; }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter(item => {
            let pertenece = false;
            eval('pertenece = item.' + campo + '.toLowerCase().indexOf("' + filter.toLocaleLowerCase() + '") !== -1;');
            return pertenece;
        });
    }
}
