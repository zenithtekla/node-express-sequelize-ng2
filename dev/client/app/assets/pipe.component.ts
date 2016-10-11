import {PipeTransform, Pipe} from "angular2/core";

@Pipe({name: 'keys'})
export class ValuesPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}