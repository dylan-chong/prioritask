import { Pipe, PipeTransform } from '@angular/core';
import { toPairs, map } from 'lodash';

@Pipe({
  name: 'keyValue',
})
export class KeyValuePipe implements PipeTransform {
  transform(value: object) {
    return map(toPairs(value), ([key, value]) => ({key, value}));
  }
}
