import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, map, switchMap, catchError } from 'rxjs/operators';
import { OfficialService } from './official-service';

export function emailUniqueValidator(service: OfficialService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((email) =>
        service.checkEmailExists(email).pipe(
          map((isTaken: boolean) => (isTaken ? { emailTaken: true } : null)),
          catchError(() => of(null))
        )
      )
    );
  };
}
