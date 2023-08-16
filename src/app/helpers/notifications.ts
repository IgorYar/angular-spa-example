import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({ providedIn: 'root' })
export class Notifications {
    constructor(private snackBar: MatSnackBar) {}

    showNotification(message: string, messageType: 'error' | 'success')  {
        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: messageType
        });
    }
}