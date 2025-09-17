import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.title || 'Confirm' }}</h2>
    <div mat-dialog-content>
      {{ data?.message || 'Are you sure?' }}
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">Cancel</button>
      <button mat-flat-button color="warn" (click)="close(true)">Delete</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<{ title?: string; message?: string }>(MAT_DIALOG_DATA, { optional: true });

  close(value: boolean) {
    this.dialogRef.close(value);
  }
}
